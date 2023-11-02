import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { testsTable } from "@/db/schema";

const postTestsRequestSchema = z.object({
  handle: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  replyToActivityId: z.number().optional(),
  startTime: z.string().optional(),
  dueTime: z.string().optional()
});

type PostTestRequest = z.infer<typeof postTestsRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postTestsRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { handle, name, replyToActivityId, startTime, dueTime } = data as PostTestRequest;
  try {
    await db
      .insert(testsTable)
      .values({
        userHandle: handle,
        name,
        replyToActivityId,
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