// app/middleware.ts
import { NextResponse } from "next/server";

const ALLOWED_EMBEDDERS = new Set<string>([
  "https://www.exucomics.com",
  "https://exucomics.com",
  "https://sandbox.weebly.com",
  "https://www.weebly.com",
]);

export function middleware(req: Request) {
  const url = new URL(req.url);
  const origin = req.headers.get("origin") || "";
  const thisOrigin = `${url.protocol}//${url.host}`;
  const sameOrigin = !origin || origin === thisOrigin;

  // Allow CORS preflight for allowed origins
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    if (sameOrigin || ALLOWED_EMBEDDERS.has(origin)) {
      res.headers.set("Access-Control-Allow-Origin", sameOrigin ? thisOrigin : origin);
      res.headers.set("Vary", "Origin");
      res.headers.set("Access-Control-Allow-Credentials", "true");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    }
    return res;
  }

  // Protect ONLY API routes; pages can be embedded freely
  if (url.pathname.startsWith("/api/")) {
    if (!(sameOrigin || ALLOWED_EMBEDDERS.has(origin))) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    const res = NextResponse.next();
    if (!sameOrigin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Vary", "Origin");
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }
    return res;
  }

  return NextResponse.next();
}

// Run only on API
export const config = { matcher: ["/api/:path*"] };
