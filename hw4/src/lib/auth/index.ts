import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import CredentialsProvider from "./CredentialsProvider";
import "next-auth";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [CredentialsProvider],
  callbacks: {
    async session({ session, token }) {
      const name = token.name || session?.user?.name;
      if (!name) return session;
      const [user] = await db
        .select({
          username: usersTable.username,
          provider: usersTable.provider,
        })
        .from(usersTable)
        .where(eq(usersTable.username, name.toLowerCase()))
        .execute();

      return {
        ...session,
        user: {
          name: user.username,
          provider: user.provider,
        },
      };
    }
  },
  pages: {
    signIn: "/",
  },
});