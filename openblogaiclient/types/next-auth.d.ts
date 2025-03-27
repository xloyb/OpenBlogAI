import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isBlocked: boolean;
    isModerator: boolean;
    isVerifiedPoster: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    error?: string;
    errorDetails?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      isBlocked: boolean;
      isModerator: boolean;
      isVerifiedPoster: boolean;
    };
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isBlocked: boolean;
    isModerator: boolean;
    isVerifiedPoster: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
  }
}