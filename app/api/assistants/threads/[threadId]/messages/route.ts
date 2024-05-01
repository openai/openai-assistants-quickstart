import OpenAI from "openai";
import { assistantId } from "../../../../../assistant-config";
const openai = new OpenAI();

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params }) {
  const body = await request.json();
  const content = body.content;
  const threadId = params.threadId;

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.createAndStream(threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
