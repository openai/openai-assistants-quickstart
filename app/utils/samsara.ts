import "server-only";

const SAMSARA_OPTIMIZATION_URL =
  process.env.SAMSARA_OPTIMIZATION_URL ||
  "https://api.samsara.com/fleet/dispatch/routes/optimization";

export async function callSamsaraOptimizer({
  payload,
}: {
  payload: Record<string, unknown>;
}) {
  const token =
    process.env.SAMSARA_API_TOKEN || process.env.SAMSARA_API_KEY || "";
  if (!token) {
    throw new Error("Missing Samsara API token");
  }

  let res: Response;
  try {
    res = await fetch(SAMSARA_OPTIMIZATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Samsara optimize request failed: ${error.message}`
        : "Samsara optimize request failed";
    throw new Error(message);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Samsara optimize failed ${res.status}: ${text}`);
  }

  return res.json();
}
