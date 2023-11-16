import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    username: { label: "Userame", type: "text", optional: true },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      username: string;
      password: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      console.log("Wrong credentials. Try again.");
      return null;
    }
    const { username, password } = validatedCredentials;

    const [existedUser] = await db
      .select({
        id: usersTable.displayId,
        username: usersTable.username,
        provider: usersTable.provider,
        hashedPassword: usersTable.hashedPassword,
      })
      .from(usersTable)
      .where(eq(usersTable.username, validatedCredentials.username.toLowerCase()))
      .execute();

    if (!existedUser) {
      // Sign up
      const hashedPassword = await bcrypt.hash(password, 10);
      const [createdUser] = await db
        .insert(usersTable)
        .values({
          username,
          hashedPassword,
          provider: "credentials",
        })
        .returning();
      return {
        name: createdUser.username,
        id: createdUser.displayId,
      };
    }

    // Sign in
    const isValid = await bcrypt.compare(password, existedUser.hashedPassword);
    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      name: existedUser.username,
      id: existedUser.id,
    };
  },
});