import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/services/authService";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    email: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        try {
          const response = await loginUser({ email, password });

          if (response) {
            const { id, email } = response;
            return {
              id,
              email,
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signIn", 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback token:", token);
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
