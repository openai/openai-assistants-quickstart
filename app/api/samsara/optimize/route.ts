import { NextResponse } from "next/server";
import { callSamsaraOptimizer } from "@/app/utils/samsara";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;

  try {
    const body = await req.json();
    payload = body?.payload;
  } catch (error) {
    console.error("Samsara optimization JSON parse error", error);
    const message =
      error instanceof Error ? error.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const isObjectPayload =
    payload && typeof payload === "object" && !Array.isArray(payload);

  if (!isObjectPayload) {
    return NextResponse.json(
      { error: "Missing payload for Samsara optimization" },
      { status: 400 }
    );
  }

  try {
    const data = await callSamsaraOptimizer({ payload });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Samsara optimization error", error);
    const message =
      error instanceof Error ? error.message : "Failed to reach Samsara";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
