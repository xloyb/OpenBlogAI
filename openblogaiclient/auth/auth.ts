import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

// Token refresh queue to prevent race conditions
let refreshPromise: Promise<JWT> | null = null;

// Interface for decoded token payload
interface AccessTokenPayload {
    userId: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isBlocked: boolean;
    isModerator: boolean;
    isVerifiedPoster: boolean;
    exp?: number;
    iat?: number;
}

// Interface for auth response
interface AuthResponse {
    accessToken?: string;
    refreshToken?: string;
    message?: string;
}

// Utility to format token expiration time
function formatTokenAge(exp?: number): string {
    if (!exp) return "No expiration";
    const tokenAge = Math.max(0, exp - Math.floor(Date.now() / 1000));
    const hours = Math.floor(tokenAge / 3600);
    const minutes = Math.floor((tokenAge % 3600) / 60);
    const seconds = tokenAge % 60;
    return `${hours}h ${minutes}m ${seconds}s remaining`;
}

// Function to refresh the access token with queue deduplication
async function refreshAccessToken(token: JWT): Promise<JWT> {
    // If there's already a refresh in progress, wait for it
    if (refreshPromise) {
        console.log("🔄 [Refresh Token] Using existing refresh promise");
        return refreshPromise;
    }

    console.log("🔄 [Refresh Token] Starting new refresh process");

    // Create new refresh promise
    refreshPromise = performTokenRefresh(token);

    try {
        const result = await refreshPromise;
        return result;
    } finally {
        // Clear the promise when done
        refreshPromise = null;
    }
}

// Actual token refresh implementation
async function performTokenRefresh(token: JWT): Promise<JWT> {
    console.log("🔄 [Refresh Token] Attempting to refresh token");
    console.log("   Current Token Details:");

    try {
        const currentRefreshToken = jwtDecode<AccessTokenPayload>(token.refreshToken as string);
        console.log(`   - Current Refresh Token: ${token.refreshToken.slice(-10)}`);
        console.log(`   - Issued At: ${new Date((currentRefreshToken.iat || 0) * 1000).toISOString()}`);
        console.log(`   - Expires: ${formatTokenAge(currentRefreshToken.exp)}`);
    } catch (decodeError) {
        console.error("❌ [Refresh Token] Unable to decode current refresh token:", decodeError);
    }

    try {
        const response = await fetch(`${process.env.API_SERVER_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.refreshToken}`,
                "Content-Type": "application/json",
            },
        });

        const responseText = await response.text();
        console.log("   Raw Server Response:", responseText);

        const parsedResponse: { accessToken: string; refreshToken: string } = JSON.parse(responseText);

        if (!response.ok) {
            console.error("❌ [Refresh Token] Server error:", parsedResponse);
            throw new Error("Unable to refresh access token");
        }

        const { accessToken, refreshToken } = parsedResponse;

        if (!accessToken || !refreshToken) {
            console.error("❌ [Refresh Token] Missing tokens in response");
            throw new Error("Received invalid tokens from server");
        }

        const decodedAccessToken = jwtDecode<AccessTokenPayload>(accessToken);
        const decodedRefreshToken = jwtDecode<AccessTokenPayload>(refreshToken);

        const accessTokenExpires = decodedAccessToken.exp
            ? decodedAccessToken.exp * 1000
            : Date.now() + 3600 * 1000; // Default to 1 hour
        const refreshTokenExpires = decodedRefreshToken.exp
            ? decodedRefreshToken.exp * 1000
            : Date.now() + 7 * 24 * 3600 * 1000; // Default to 7 days

        console.log("✅ [Refresh Token] Successfully refreshed");
        console.log(`   - New Access Token: ${accessToken.slice(-10)}`);
        console.log(`   - Expires: ${formatTokenAge(decodedAccessToken.exp)}`);

        return {
            ...token,
            accessToken,
            refreshToken,
            accessTokenExpires,
            refreshTokenExpires,
            error: undefined, // Clear any previous error
            errorDetails: undefined,
        };
    } catch (error) {
        console.error("❌ [Refresh Token] Error:", error);
        // Return a token state that invalidates the session
        return {
            ...token,
            accessToken: token.accessToken || "",  // Provide empty string as fallback
            refreshToken: token.refreshToken || "", // Provide empty string as fallback
            accessTokenExpires: 0,
            refreshTokenExpires: 0,
            error: "RefreshAccessTokenError",
            errorDetails: error instanceof Error ? error.message : "An error occurred",
        };
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
        updateAge: 30,
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials): Promise<User | null> {
                console.log("🔐 [Login] Attempting to authorize");
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await fetch(`${process.env.API_SERVER_BASE_URL}/api/auth/login`, {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" },
                    });

                    const responseText = await res.text();
                    const parsedResponse: AuthResponse = JSON.parse(responseText);

                    if (!res.ok) throw new Error(parsedResponse.message || "Authentication failed");

                    const { accessToken, refreshToken } = parsedResponse;

                    if (!accessToken || !refreshToken) {
                        throw new Error("Invalid response: missing tokens");
                    }

                    const decodedAccessToken = jwtDecode<AccessTokenPayload>(accessToken);
                    const decodedRefreshToken = jwtDecode<AccessTokenPayload>(refreshToken);

                    const accessTokenExpires = decodedAccessToken.exp
                        ? decodedAccessToken.exp * 1000
                        : Date.now() + 3600 * 1000;
                    const refreshTokenExpires = decodedRefreshToken.exp
                        ? decodedRefreshToken.exp * 1000
                        : Date.now() + 7 * 24 * 3600 * 1000;

                    console.log("✅ [Login] Authentication successful");
                    console.log(`   - Access Token: ${accessToken.slice(-10)}`);
                    console.log(`   - Expires: ${formatTokenAge(decodedAccessToken.exp)}`);

                    return {
                        id: decodedAccessToken.userId,
                        name: decodedAccessToken.name,
                        email: decodedAccessToken.email,
                        isAdmin: decodedAccessToken.isAdmin,
                        isBlocked: decodedAccessToken.isBlocked,
                        isModerator: decodedAccessToken.isModerator,
                        isVerifiedPoster: decodedAccessToken.isVerifiedPoster,
                        accessToken,
                        refreshToken,
                        accessTokenExpires,
                        refreshTokenExpires,
                    };
                } catch (error) {
                    console.error("❌ [Login] Error:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
            console.log("🔑 [JWT Callback] Processing JWT");

            if (user) {
                console.log("🆕 [JWT Callback] Initial token creation");
                return {
                    id: user.id as string,
                    name: user.name || "Anonymous",
                    email: user.email || "no-email",
                    isAdmin: user.isAdmin,
                    isBlocked: user.isBlocked,
                    isModerator: user.isModerator,
                    isVerifiedPoster: user.isVerifiedPoster,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    refreshTokenExpires: user.refreshTokenExpires,
                };
            }

            const now = Date.now();
            if (token.accessTokenExpires && now < token.accessTokenExpires) {
                console.log("✅ [JWT Callback] Access Token still valid");
                return token;
            }

            console.log("🔄 [JWT Callback] Access Token expired, refreshing");
            const refreshedToken = await refreshAccessToken(token);

            // If refresh fails, invalidate the session
            if (refreshedToken.error === "RefreshAccessTokenError") {
                console.log("❌ [JWT Callback] Refresh failed, invalidating session");
                return {
                    ...token,
                    accessToken: "",
                    refreshToken: "",
                    accessTokenExpires: 0,
                    refreshTokenExpires: 0,
                    error: "RefreshAccessTokenError",
                    errorDetails: refreshedToken.errorDetails,
                };
            }

            return refreshedToken;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            console.log("👤 [Session Callback] Creating session");

            if (token.error || !token.accessToken) {
                console.error("❌ [Session Callback] Token invalid or errored:", token.error);
                return {
                    ...session,
                    user: {
                        id: "",
                        name: "",
                        email: "",
                        isAdmin: false,
                        isBlocked: false,
                        isModerator: false,
                        isVerifiedPoster: false,
                    },
                    accessToken: "",
                    accessTokenExpires: 0,
                    error: token.error || "SessionInvalid",
                };
            }

            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
                isAdmin: token.isAdmin,
                isBlocked: token.isBlocked,
                isModerator: token.isModerator,
                isVerifiedPoster: token.isVerifiedPoster,
            };
            session.accessToken = token.accessToken;
            session.accessTokenExpires = token.accessTokenExpires;

            console.log("✅ [Session Callback] Session created");
            return session;
        },
    },
});