import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { activitiesTable } from "@/db/schema";

const postActivityRequestSchema = z.object({
  handle: z.string().min(1).max(50),
  name: z.string().min(1).max(80),
  replyToActivityId: z.number().optional(),
  startTime: z.string().optional(),
  dueTime: z.string().optional()
});

type PostActivityRequest = z.infer<typeof postActivityRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { handle, name, replyToActivityId, startTime, dueTime } = data as PostActivityRequest;
  try {
    await db
      .insert(activitiesTable)
      .values({
        userHandle: handle,
        name,
        replyToActivityId,
        startTime,
        dueTime
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