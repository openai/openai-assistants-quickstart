
// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // When someone opens the root URL, send them directly to the full chat
  redirect("/examples/all");
}
