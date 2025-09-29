import { auth } from "@/auth/auth";
import type { Session } from "next-auth";

let cachedSession: Session | null = null;

interface FetchClientOptions extends RequestInit {
  url: string;
  skipAuth?: boolean;
}

export async function fetchClient(options: FetchClientOptions) {
  const { url, skipAuth = false, ...fetchOptions } = options;

  // Skip authentication for public endpoints
  if (skipAuth) {
    const response = await fetch(url, fetchOptions);
    return response;
  }

  // Get current session (this will handle token refresh automatically)
  cachedSession = await auth();

  if (!cachedSession?.accessToken) {
    throw new Error("Unauthenticated - please log in");
  }

  // Check if session has error (failed token refresh)
  if ('error' in cachedSession && cachedSession.error) {
    throw new Error(`Authentication error: ${cachedSession.error}`);
  }

  // Make authenticated request
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cachedSession.accessToken}`,
      ...fetchOptions.headers,
    },
  });

  // Handle 401 responses (token might be expired despite refresh)
  if (response.status === 401) {
    // Clear cached session and retry once
    cachedSession = null;
    const retrySession = await auth();

    if (!retrySession?.accessToken) {
      throw new Error("Authentication failed - please log in again");
    }

    const retryResponse = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${retrySession.accessToken}`,
        ...fetchOptions.headers,
      },
    });

    return retryResponse;
  }

  return response;
}

// Convenience methods for common HTTP verbs
export const fetchClient$ = {
  get: (url: string, options?: Omit<FetchClientOptions, 'url' | 'method'>) =>
    fetchClient({ url, method: 'GET', ...options }),

  post: (url: string, data?: unknown, options?: Omit<FetchClientOptions, 'url' | 'method' | 'body'>) =>
    fetchClient({ url, method: 'POST', body: JSON.stringify(data), ...options }),

  put: (url: string, data?: unknown, options?: Omit<FetchClientOptions, 'url' | 'method' | 'body'>) =>
    fetchClient({ url, method: 'PUT', body: JSON.stringify(data), ...options }),

  delete: (url: string, options?: Omit<FetchClientOptions, 'url' | 'method'>) =>
    fetchClient({ url, method: 'DELETE', ...options }),
};