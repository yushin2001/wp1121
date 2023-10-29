import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { joinsTable } from "@/db/schema";

const joinActivityRequestSchema = z.object({
  activityId: z.number().positive(),
  userHandle: z.string().min(1).max(50),
});

type JoinActivityRequest = z.infer<typeof joinActivityRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    joinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { activityId, userHandle } = data as JoinActivityRequest;

  try {
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(joinsTable)
      .where(
        and(
          eq(joinsTable.activityId, activityId),
          eq(joinsTable.userHandle, userHandle),
        ),
      )
      .execute();

    return NextResponse.json({ liked: Boolean(exist) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    joinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { activityId, userHandle } = data as JoinActivityRequest;

  try {
    await db
      .insert(joinsTable)
      .values({
        activityId,
        userHandle,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    joinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { activityId, userHandle } = data as JoinActivityRequest;

  try {
    await db
      .delete(joinsTable)
      .where(
        and(
          eq(joinsTable.activityId, activityId),
          eq(joinsTable.userHandle, userHandle),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}