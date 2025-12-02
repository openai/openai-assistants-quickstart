import "server-only";

const NEXTBILLION_OPTIMIZATION_URL =
  process.env.NEXTBILLION_OPTIMIZATION_URL ||
  "https://api.nextbillion.io/route-optimization/v1";

export async function callNextBillionOptimizer({
  payload,
}: {
  payload: Record<string, unknown>;
}) {
  const key = process.env.NEXTBILLION_API_KEY || "";
  if (!key) {
    throw new Error("Missing NextBillion API key");
  }

  const url = `${NEXTBILLION_OPTIMIZATION_URL}?key=${encodeURIComponent(key)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `NextBillion optimize request failed: ${error.message}`
        : "NextBillion optimize request failed";
    throw new Error(message);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NextBillion optimize failed ${res.status}: ${text}`);
  }

  return res.json();
}
