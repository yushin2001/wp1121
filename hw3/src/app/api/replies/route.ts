import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { repliesTable } from "@/db/schema";

const postReplyRequestSchema = z.object({
    comment: z.string().max(200),
    userHandle: z.string().min(1).max(50),
    activityId: z.number().positive()
});

type PostActivityRequest = z.infer<typeof postReplyRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postReplyRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { activityId, userHandle, comment } = data as PostActivityRequest;
  try {
    await db
    .insert(repliesTable)
    .values({
        comment,
        userHandle,
        activityId
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