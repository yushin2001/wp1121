import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { activitiesTable } from "@/db/schema";

const postActivityRequestSchema = z.object({
  handle: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  replyToTweetId: z.number().optional(),
  startTime: z.date().min(new Date("2023-11-4")).max(new Date("3000-01-01")),
  dueTime: z.date().min(new Date("2023-11-4")).max(new Date("3000-01-01"))
});

type PostActivityRequest = z.infer<typeof postActivityRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { handle, name, replyToTweetId, startTime, dueTime } = data as PostActivityRequest;
  try {
    await db
      .insert(activitiesTable)
      .values({
        userHandle: handle,
        name,
        replyToTweetId,
        startTime,
        dueTime
      })
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
  return new NextResponse("OK", { status: 200 });
}