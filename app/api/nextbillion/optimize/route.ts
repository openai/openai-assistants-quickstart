import { NextResponse } from "next/server";
import { callNextBillionOptimizer } from "@/app/utils/nextbillion";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;

  try {
    const body = await req.json();
    payload = body?.payload;
  } catch (error) {
    console.error("NextBillion optimization JSON parse error", error);
    const message =
      error instanceof Error ? error.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const isObjectPayload =
    payload && typeof payload === "object" && !Array.isArray(payload);

  if (!isObjectPayload) {
    return NextResponse.json(
      { error: "Missing payload for NextBillion optimization" },
      { status: 400 }
    );
  }

  try {
    const data = await callNextBillionOptimizer({ payload: payload as Record<string, unknown> });
    return NextResponse.json(data);
  } catch (error) {
    console.error("NextBillion optimization error", error);
    const message =
      error instanceof Error ? error.message : "Failed to reach NextBillion";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
