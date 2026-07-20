import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    error?: "RefreshAccessTokenError";
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }

  interface User {
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
    error?: "RefreshAccessTokenError";
    id?: string;
    role?: string;
  }
}
