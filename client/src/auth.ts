import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const demoEmail = process.env.DEMO_USER_EMAIL ?? "demo@saasmanager.app";
const demoPassword = process.env.DEMO_USER_PASSWORD ?? "ChangeMe123!";
const demoName = process.env.DEMO_USER_NAME ?? "Jordan Lee";
const demoRole = process.env.DEMO_USER_ROLE ?? "Product Manager";

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

        if (
          email.toLowerCase() !== demoEmail.toLowerCase() ||
          password !== demoPassword
        ) {
          return null;
        }

        return {
          id: "demo-user",
          email: demoEmail,
          name: demoName,
          role: demoRole,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "demo-user";
        session.user.role =
          typeof token.role === "string" ? token.role : demoRole;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
});
