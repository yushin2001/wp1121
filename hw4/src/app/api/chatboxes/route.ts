import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { chatboxesTable } from "@/db/schema";

const postNewChatboxRequestSchema = z.object({
    user1: z.string().min(1).max(80),
    user2: z.string().min(1).max(80)
});

type PostNewChatboxRequest = z.infer<typeof postNewChatboxRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postNewChatboxRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { user1, user2 } = data as PostNewChatboxRequest;
  try {
    await db
      .insert(chatboxesTable)
      .values({
        user1: user1,
        user2: user2
      })
      .execute();
      return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}