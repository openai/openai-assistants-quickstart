export let assistantId = "asst_1hDEC0VYhrcW3CbAk9rB7sa1";

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
