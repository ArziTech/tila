import "server-only";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { getUserById, setUsername } from "@/actions/user";
import authConfig from "@/auth.config";
import type { PrismaClient } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  events: {
    // async linkAccount({ user }) {
    //   await prisma.user.update({
    //     where: { id: user.id },
    //     data: { emailVerified: new Date() },
    //   });
    // },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id as string);
      return !!existingUser;
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },

    async session({ session, token }) {
      // Fetch fresh user data from database to get latest changes
      const dbUser = await getUserById(token.sub as string);

      if (dbUser.status === "SUCCESS" && dbUser.data) {
        session.user = {
          ...session.user,
          ...dbUser.data,
        };
      } else {
        session.user = token.user;
      }
      // session.user.roles = token.roles;
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (trigger === "signUp") {
        // @ts-expect-error this is okay
        if (!user.username) {
          const random2DigitNumber = Math.floor(Math.random() * 90) + 10;
          const defaultUsername = `${user.name}${random2DigitNumber}`;
          await setUsername(user.id as string, defaultUsername);
          // const roleId = "2"; // 2 for default CUSTOMER
          // await setRole(user.id as string, roleId);
        }
      }
      if (user?.id) {
        // const userFromDB = (await getUserById(user.id)).data;
        // token.roles = userFromDB?.roles;

        token.user = user;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma as PrismaClient),
  session: { strategy: "jwt" },
  ...authConfig,
});
