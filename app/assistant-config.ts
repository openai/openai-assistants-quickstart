export let assistantId = ""; // asst_dLiaMuKISxoNoeUD7FWSAY7v

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
