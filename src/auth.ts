import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./utils/connect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [Google],

  callbacks: {
    async session({ session, token, user }) {
      // This assumes your User model has `isAdmin` field
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        });

        session.user.isAdmin = dbUser?.isAdmin ?? false;
      }

      return session;
    },
  },
});

// creating a function that can check if a user is in session for the server side components

export const getAuthSession = () => auth();
// to get server session
