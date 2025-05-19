import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  try {
    const { content, attachments } = await request.json();
    
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
      attachments: attachments,
    });

    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    return new Response(stream.toReadableStream());
  } catch (error) {
    console.error("Error processing message:", error);
    return new Response(JSON.stringify({ error: "Error processing message" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
