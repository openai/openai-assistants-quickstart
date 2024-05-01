import OpenAI from "openai";
const openai = new OpenAI();

export const runtime = "nodejs";

// Create a new thread
export async function POST() {
  const thread = await openai.beta.threads.create();
  return new Response(JSON.stringify({ threadId: thread.id }));
}
