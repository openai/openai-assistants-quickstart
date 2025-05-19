"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

// --- SVG Icons (Paperclip, Send, File Types) ---
const PaperclipIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
);

const PDFIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm11 .5h1v1h-1v-1z"></path></svg>
);
// --- End SVG Icons ---

type MessageProps = {
  role: "user" | "assistant" | "code" | "systemInfo";
  text: string;
};

const UserMessage = ({ text }: { text: string }) => (
  <div className={styles.userMessageWrapper}>
    <div className={styles.userMessage}><Markdown>{text}</Markdown></div>
  </div>
);

const AssistantMessage = ({ text }: { text: string }) => (
  <div className={styles.assistantMessageWrapper}>
    <div className={styles.assistantMessage}><Markdown>{text}</Markdown></div>
  </div>
);

const CodeMessage = ({ text }: { text: string }) => (
  <div className={styles.codeMessageWrapper}>
    <pre className={styles.codeMessage}><code>{text}</code></pre>
  </div>
);

const SystemInfoMessage = ({ text }: { text: string }) => (
  <div className={styles.systemInfoMessage}>{text}</div>
);

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    case "systemInfo":
      return <SystemInfoMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (toolCall: RequiredActionFunctionToolCall) => Promise<string>;
};

const Chat = ({ functionCallHandler = () => Promise.resolve("") }: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Array<MessageProps>>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showFileUploadOptions, setShowFileUploadOptions] = useState(false);
  const [fileIdsForNextMessage, setFileIdsForNextMessage] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRefImage = useRef<HTMLInputElement | null>(null);
  const fileInputRefPdf = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const createThread = async () => {
      try {
        const res = await fetch(`/api/assistants/threads`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to create thread");
        const data = await res.json();
        setThreadId(data.threadId);
      } catch (error) {
        console.error("Error creating thread:", error);
        setMessages([{ role: "systemInfo", text: "Error: Could not start a new chat session. Please refresh." }]);
      }
    };
    createThread();
  }, []);
  
  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => setUploadStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const handleStreamResponse = (stream: AssistantStream) => {
    stream.on("textCreated", () => appendMessage("assistant", ""));
    stream.on("textDelta", (delta) => {
      if (delta.value != null) appendToLastMessage(delta.value);
      if (delta.annotations != null) annotateLastMessage(delta.annotations);
    });
    stream.on("imageFileDone", (image) => appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`));
    stream.on("toolCallCreated", (toolCall) => {
      if (toolCall.type === "code_interpreter") appendMessage("code", "");
    });
    stream.on("toolCallDelta", (delta) => {
      if (delta.type === "code_interpreter" && delta.code_interpreter?.input) {
        appendToLastMessage(delta.code_interpreter.input);
      }
    });
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action") handleRequiresAction(event as AssistantStreamEvent.ThreadRunRequiresAction);
      if (event.event === "thread.run.completed") setIsSendingMessage(false);
      if (event.event === "thread.run.failed") {
        setIsSendingMessage(false);
        setMessages(prev => [...prev, {role: "systemInfo", text: "The assistant run failed. Please try again."}]);
      }
    });
  };

  const sendMessageToApi = async (text: string, currentThreadId: string, fileIds?: string[]) => {
    try {
      const bodyPayload: { content: string; attachments?: any[] } = { content: text };
      if (fileIds && fileIds.length > 0) {
        bodyPayload.attachments = fileIds.map(id => ({ file_id: id, tools: [{ type: "file_search" }] }));
      }

      const response = await fetch(`/api/assistants/threads/${currentThreadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      if (!response.ok || !response.body) throw new Error("Failed to send message");
      handleStreamResponse(AssistantStream.fromReadableStream(response.body));
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSendingMessage(false);
      setMessages(prev => [...prev, { role: "systemInfo", text: `Error sending message: ${(error as Error).message}` }]);
    }
  };
  
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!userInput.trim() || !threadId) return;

    const currentMessage = userInput;
    setMessages((prevMessages) => [...prevMessages, { role: "user", text: currentMessage }]);
    setUserInput("");
    setIsSendingMessage(true);
    setShowFileUploadOptions(false); 
    await sendMessageToApi(currentMessage, threadId, fileIdsForNextMessage);
    setFileIdsForNextMessage([]);
  };
  
  const handleRequiresAction = async (event: AssistantStreamEvent.ThreadRunRequiresAction) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    
    try {
      const toolCallOutputs = await Promise.all(
        toolCalls.map(async (toolCall) => {
          const result = await functionCallHandler(toolCall);
          return { output: result, tool_call_id: toolCall.id };
        })
      );
      
      const response = await fetch(`/api/assistants/threads/${threadId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, toolCallOutputs }),
      });
      if (!response.ok || !response.body) throw new Error("Failed to submit tool action");
      handleStreamResponse(AssistantStream.fromReadableStream(response.body));
    } catch (error) {
      console.error("Error submitting tool action:", error);
      setIsSendingMessage(false);
      setMessages(prev => [...prev, { role: "systemInfo", text: `Error processing tool action: ${(error as Error).message}` }]);
    }
  };

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage) {
        const updatedLastMessage = { ...lastMessage, text: lastMessage.text + text };
        return [...prevMessages.slice(0, -1), updatedLastMessage];
      }
      return prevMessages;
    });
  };

  const appendMessage = (role: MessageProps["role"], text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations: any[]) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (!lastMessage || !lastMessage.text) return prevMessages;
      
      let newText = lastMessage.text;
      annotations.forEach((annotation: any) => {
        if (annotation.type === 'file_path' && annotation.file_path) {
          newText = newText.replaceAll(annotation.text, ''); // Remove placeholder, file already linked or handled by assistant
        }
      });
      const updatedLastMessage = { ...lastMessage, text: newText };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // Reset file input
    if (!file) return;

    setIsUploadingFile(true);
    setUploadStatus(null);
    setShowFileUploadOptions(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('/api/files/upload', { method: 'POST', body: formData });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to upload ${fileType}`);
      }
      
      const successMessage = `\"${result.fileName}\" uploaded successfully. The assistant has been notified and can now access this file using its ID: ${result.fileId}`;
      setUploadStatus({ type: 'success', message: successMessage });
      
      // Add fileId for the next message instead of sending an auto-message immediately
      setFileIdsForNextMessage(prev => [...prev, result.fileId]);
      // Optionally, send a system message to UI that file is ready for next query
      appendMessage("systemInfo", `File \"${result.fileName}\" ready. It will be attached to your next message for search.`);

    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      setUploadStatus({ type: 'error', message: `Upload failed: ${(error as Error).message}` });
    } finally {
      setIsUploadingFile(false);
    }
  };
  
  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatPanel}>
        <div className={styles.messagesArea}>
          {messages.length === 0 && !isSendingMessage && (
            <div className={styles.welcomeMessage}>
              <h2>Welcome to the OpenAI Assistant!</h2>
              <p>You can ask questions, get help with code, or upload files for the assistant to process.</p>
              <p>Type your message below or use the paperclip icon to attach files.</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}
          <div ref={messagesEndRef} /> {/* For auto-scrolling */}
        </div>

        {uploadStatus && (
          <div className={`${styles.uploadStatusMessage} ${uploadStatus.type === 'error' ? styles.error : styles.success}`}>
            {uploadStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.inputArea}>
          <div className={styles.inputControls}>
            <button 
              type="button" 
              className={styles.iconButton} 
              onClick={() => setShowFileUploadOptions(!showFileUploadOptions)}
              aria-label="Attach file"
              disabled={isSendingMessage || isUploadingFile}
            >
              <PaperclipIcon />
            </button>
            {showFileUploadOptions && (
              <div className={styles.fileUploadPopover}>
                <button onClick={() => triggerFileInput(fileInputRefImage)} disabled={isUploadingFile}>
                  <ImageIcon /> Image
                </button>
                <input type="file" accept="image/*" ref={fileInputRefImage} hidden onChange={(e) => handleFileUpload(e, 'image')} />
                <button onClick={() => triggerFileInput(fileInputRefPdf)} disabled={isUploadingFile}>
                  <PDFIcon /> PDF
                </button>
                <input type="file" accept="application/pdf" ref={fileInputRefPdf} hidden onChange={(e) => handleFileUpload(e, 'pdf')} />
              </div>
            )}
            <input
              type="text"
              className={styles.textInput}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isUploadingFile ? "Uploading file..." : (isSendingMessage ? "Assistant is typing..." : "Type your message...")}
              disabled={isSendingMessage || isUploadingFile}
            />
            <button 
              type="submit" 
              className={styles.sendButton} 
              disabled={!userInput.trim() || isSendingMessage || isUploadingFile}
              aria-label="Send message"
            >
              {isSendingMessage ? <div className={styles.spinner}></div> : <SendIcon />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
