import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  authenticateWithApi,
  refreshApiSession,
} from "@/features/auth/lib/api-auth";

const REFRESH_BUFFER_MS = 1000 * 60;

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        return authenticateWithApi({ email, password })
          .then((data) => {
            if (!data) {
              return null;
            }

            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              accessToken: data.accessToken,
              accessTokenExpiresAt: data.accessTokenExpiresAt,
              refreshToken: data.refreshToken,
            };
          })
          .catch(() => null);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.refreshToken = user.refreshToken;
        token.error = undefined;
        return token;
      }

      const accessTokenExpiresAt =
        typeof token.accessTokenExpiresAt === "number"
          ? token.accessTokenExpiresAt
          : 0;

      if (
        typeof token.accessToken === "string" &&
        Date.now() < accessTokenExpiresAt - REFRESH_BUFFER_MS
      ) {
        return token;
      }

      if (typeof token.refreshToken !== "string") {
        token.accessToken = undefined;
        token.error = "RefreshAccessTokenError";
        return token;
      }

      const refreshedSession = await refreshApiSession(token.refreshToken).catch(
        () => null
      );

      if (!refreshedSession) {
        token.accessToken = undefined;
        token.refreshToken = undefined;
        token.error = "RefreshAccessTokenError";
        return token;
      }

      token.id = refreshedSession.user.id;
      token.role = refreshedSession.user.role;
      token.accessToken = refreshedSession.accessToken;
      token.accessTokenExpiresAt = refreshedSession.accessTokenExpiresAt;
      token.refreshToken = refreshedSession.refreshToken;
      token.error = undefined;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = typeof token.role === "string" ? token.role : "";
      }
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : "";
      session.error =
        token.error === "RefreshAccessTokenError" ? token.error : undefined;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
