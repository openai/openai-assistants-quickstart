import OpenAI from "openai";
const openai = new OpenAI();

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params }) {
  const body = await request.json();
  const toolCallOutputs = body.toolCallOutputs;
  const runId = body.runId;
  const threadId = params.threadId;

  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    threadId,
    runId,
    // { tool_outputs: [{ output: result, tool_call_id: toolCallId }] },
    { tool_outputs: toolCallOutputs }
  );

  return new Response(stream.toReadableStream());
}
