import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateWithApi } from "@/features/auth/lib/api-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
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
            };
          })
          .catch(() => null);
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = typeof token.role === "string" ? token.role : "";
      }
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : "";
      return session;
    },
  },
  pages: { signIn: "/login" },
});
