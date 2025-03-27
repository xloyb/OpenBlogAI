import { auth } from "@/auth/auth";
import type { Session } from "next-auth";

let cachedSession: Session | null = null;

export async function fetchClient() {
  cachedSession = await auth();

  if (!cachedSession?.accessToken) {
    throw new Error("Unauthenticated");
  }

  // Example fetch logic
  const response = await fetch("some-api-endpoint", {
    headers: {
      Authorization: `Bearer ${cachedSession.accessToken}`,
    },
  });

  return response.json();
}