import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { messagesTable } from "@/db/schema";

const postMessageRequestSchema = z.object({
    replyToChatboxId: z.string(),
    sendername: z.string().min(1).max(80),
    receivername: z.string().min(1).max(80),
    content: z.string().min(1).max(80)
});

type PostMessageyRequest = z.infer<typeof postMessageRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postMessageRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { replyToChatboxId, sendername, receivername, content } = data as PostMessageyRequest;
  try {
    await db
      .insert(messagesTable)
      .values({
        chatboxId: replyToChatboxId,
        sendername: sendername,
        receivername: receivername,
        content: content
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