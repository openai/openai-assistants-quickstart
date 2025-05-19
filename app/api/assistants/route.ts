import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
  try {
    const assistant = await openai.beta.assistants.create({
      instructions: "You are a helpful assistant.",
      name: "Quickstart Assistant",
      model: "gpt-4o",
      tools: [
        { type: "code_interpreter" },
        {
          type: "function",
          function: {
            name: "get_weather",
            description: "Determine weather in my location",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The city and state e.g. San Francisco, CA",
                },
                unit: {
                  type: "string",
                  enum: ["c", "f"],
                },
              },
              required: ["location"],
            },
          },
        },
        { type: "file_search" },
      ],
    });
    return Response.json({ assistantId: assistant.id });
  } catch (error) {
    console.error("Detailed error creating assistant:", error instanceof Error ? error.message : error);
    console.error(error instanceof Error ? error.stack : "No stack trace available");
    return new Response("Internal Server Error", { status: 500 });
  }
}
