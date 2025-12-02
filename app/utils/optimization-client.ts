type Provider = "nextbillion" | "samsara";

async function postOptimization(
  url: string,
  payload: Record<string, unknown>,
  fallbackMessage: string
) {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload }),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `${fallbackMessage}: ${error.message}`
        : fallbackMessage;
    throw new Error(message);
  }

  let body: any;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }

  if (!res.ok) {
    const message = body?.error || body?.message || fallbackMessage;
    throw new Error(message);
  }

  return body;
}

export async function proxyNextBillionOptimization(
  payload: Record<string, unknown>
) {
  return postOptimization(
    "/api/nextbillion/optimize",
    payload,
    "NextBillion optimization request failed"
  );
}

export async function proxySamsaraOptimization(payload: Record<string, unknown>) {
  return postOptimization(
    "/api/samsara/optimize",
    payload,
    "Samsara optimization request failed"
  );
}

export async function proxyOptimization(
  payload: Record<string, unknown>,
  provider: Provider
) {
  return provider === "samsara"
    ? proxySamsaraOptimization(payload)
    : proxyNextBillionOptimization(payload);
}
