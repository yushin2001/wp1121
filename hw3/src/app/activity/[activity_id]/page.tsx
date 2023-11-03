import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, desc, and } from "drizzle-orm";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import JoinButton from "@/components/JoinButton";
import ReplyActivityInput from "@/components/ReplyActivityInput";
import TimeText from "@/components/TimeText";
import Reply from "@/components/Reply";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { joinsTable, activitiesTable, usersTable } from "@/db/schema";
import { getAvatar } from "@/lib/utils";

type ActivityPageProps = {
  params: {
    activity_id: string;
  };
  searchParams: {
    username?: string;
    handle?: string;
  };
};

export default async function ActivityPage({
  params: { activity_id },
  searchParams: { username, handle },
}: ActivityPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    handle && params.set("handle", handle);
    redirect(`/?${params.toString()}`);
  };
  const activity_id_num = parseInt(activity_id);
  if (isNaN(activity_id_num)) {
    errorRedirect();
  }

  const [ActivityData] = await db
    .select({
      id: activitiesTable.id,
      name: activitiesTable.name,
      userHandle: activitiesTable.userHandle,
      createdAt: activitiesTable.createdAt,
      startTime: activitiesTable.startTime,
      dueTime: activitiesTable.dueTime
    })
    .from(activitiesTable)
    .where(eq(activitiesTable.id, activity_id_num))
    .execute();

  if (!ActivityData) {
    errorRedirect();
  }

  const joins = await db
    .select({
      id: joinsTable.id,
    })
    .from(joinsTable)
    .where(eq(joinsTable.activityId, activity_id_num))
    .execute();

  const numJoins = joins.length;

  const [joined] = await db
    .select({
      id: joinsTable.id,
    })
    .from(joinsTable)
    .where(
      and(
        eq(joinsTable.activityId, activity_id_num),
        eq(joinsTable.userHandle, handle ?? ""),
      ),
    )
    .execute();

  const [user] = await db
    .select({
      displayName: usersTable.displayName,
      handle: usersTable.handle,
    })
    .from(usersTable)
    .where(eq(usersTable.handle, ActivityData.userHandle))
    .execute();

  const activity = {
    id: ActivityData.id,
    name: ActivityData.name,
    username: user.displayName,
    handle: user.handle,
    joins: numJoins,
    createdAt: ActivityData.createdAt,
    joined: Boolean(joined),
    startTime: ActivityData.startTime,
    dueTime: ActivityData.dueTime,
  };

  const replies = await db
  .select({
    id: activitiesTable.id,
    name: activitiesTable.name,
    username: usersTable.displayName,
    handle: usersTable.handle,
    createdAt: activitiesTable.createdAt,
  })
  .from(activitiesTable)
  .where(eq(activitiesTable.replyToActivityId, activity_id_num))
  .orderBy(desc(activitiesTable.createdAt))
  .innerJoin(usersTable, eq(activitiesTable.userHandle, usersTable.handle))
  .execute();

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col pt-2">

        <div className="mb-2 flex items-center gap-8 px-4">
          <Link href={{ pathname: "/", query: { username, handle } }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">Activity</h1>
        </div>


        <div className="flex flex-col px-4 pt-3">

          <div className="flex justify-between">
            <div className="flex w-full gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAvatar(activity.username)}
                alt="user avatar"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-bold">{activity.username ?? "..."}</p>
                <p className="font-normal text-gray-500">
                  @{activity.handle ?? "..."}
                </p>
              </div>
            </div>
            <button className="h-fit rounded-full p-2.5 text-gray-400 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <time className="my-4 block text-sm text-gray-500">
            <TimeText date={activity.createdAt} format="YYYY-MM-D · h:mm A " />
          </time>

          <h2 className="text-xl font-bold bg-brand/10 rounded-md p-3 mt-2 mb-2"> 活動名稱：{activity.name} </h2>
          <h4 className="text-lg flex-row bg-brand/10 rounded-md p-2 mt-1 mb-1"> 開始時間：{activity.startTime}:00 </h4>
          <h4 className="text-lg flex-row bg-brand/10 rounded-md p-2 mt-1 mb-1"> 結束時間：{activity.dueTime}:00 </h4>
          
          <div className="flex flex-row pb-3 pt-2">
            <JoinButton
              handle={handle}
              initialJoined={activity.joined}
              activityId={activity.id}
            />
          </div>

          <Separator />

        </div>

        <ReplyActivityInput activityId={activity.id} replyToHandle={activity.handle} attend={activity.joined}/>
        
        <Separator />

        {replies.map((reply) => (
          <Reply
            key={reply.id}
            authorName={reply.username}
            authorHandle={reply.handle}
            name={reply.name}
            createdAt={reply.createdAt!}
          />
        ))}
        
      </div>
    </>
  );
}
