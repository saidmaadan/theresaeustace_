import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// import { LoginSchema } from "@/schemas";
// import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          return null;
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in!");
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/error",
    verifyRequest: "/verify-request",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
