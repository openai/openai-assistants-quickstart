export let assistantId = "asst_1hDEC0VYhrcW3CbAk9rB7sa1";

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
  if (!assistantId) {
      throw new Error(
        "Please set the OPENAI_ASSISTANT_ID environment variable or set assistantId in app/assistant-config.ts"
      );
    }
  }