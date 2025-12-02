import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
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
      {
        type: "function",
        function: {
          name: "call_briostack",
          description: "Make a request to the Briostack API",
          parameters: {
            type: "object",
            properties: {
              endpoint: {
                type: "string",
                description: "The Briostack endpoint path, e.g. '/v1/properties'",
              },
              method: {
                type: "string",
                enum: ["GET", "POST", "PUT", "DELETE"],
              },
              payload: {
                type: "object",
                description: "JSON body for POST/PUT requests",
              },
              query: {
                type: "object",
                description: "Query params as key/value pairs",
              },
            },
            required: ["endpoint", "method"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "optimize_routes",
          description:
            "Optimize technician routes using server-side provider proxies",
          parameters: {
            type: "object",
            properties: {
              payload: {
                type: "object",
                description:
                  "JSON body to send to the selected route optimization provider",
              },
              provider: {
                type: "string",
                enum: ["nextbillion", "samsara"],
                description:
                  "Route optimization provider to use (defaults to NextBillion)",
              },
            },
            required: ["payload"],
          },
        },
      },
      { type: "file_search" },
    ],
  });
  return Response.json({ assistantId: assistant.id });
}
