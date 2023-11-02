import Link from "next/link";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  MessageCircle,
  MoreHorizontal
} from "lucide-react";

import TimeText from "@/components/TimeText";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { testsTable, usersTable } from "@/db/schema";
import { getAvatar } from "@/lib/utils";

type TestPageProps = {
  params: {
    test_id: string;
  };
  searchParams: {
    username?: string;
    handle?: string;
  };
};

export default async function TestPage({
  params: { test_id },
  searchParams: { username, handle },
}: TestPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    handle && params.set("handle", handle);
    redirect(`/?${params.toString()}`);
  };
  const test_id_num = parseInt(test_id);
  if (isNaN(test_id_num)) {
    errorRedirect();
  }

  const [TestData] = await db
    .select({
      id: testsTable.id,
      name: testsTable.name,
      userHandle: testsTable.userHandle,
      createdAt: testsTable.createdAt,
      startTime: testsTable.startTime,
      dueTime: testsTable.dueTime
    })
    .from(testsTable)
    .where(eq(testsTable.id, test_id_num))
    .execute();

  if (!TestData) {
    errorRedirect();
  }

  const [user] = await db
    .select({
      displayName: usersTable.displayName,
      handle: usersTable.handle,
    })
    .from(usersTable)
    .where(eq(usersTable.handle, TestData.userHandle))
    .execute();

  const test = {
    id: TestData.id,
    name: TestData.name,
    username: user.displayName,
    handle: user.handle,
    createdAt: TestData.createdAt,
    startTime: TestData.startTime,
    dueTime: TestData.dueTime
  };

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">


        <div className="mb-2 flex items-center gap-8 px-4">
          <Link href={{ pathname: "/", query: { username, handle } }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">Test</h1>
        </div>


        <div className="flex flex-col px-4 pt-3">

          <div className="flex justify-between">
            <div className="flex w-full gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAvatar(test.username)}
                alt="user avatar"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-bold">{test.username ?? "..."}</p>
                <p className="font-normal text-gray-500">
                  @{test.handle ?? "..."}
                </p>
              </div>
            </div>
            <button className="h-fit rounded-full p-2.5 text-gray-400 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <article className="mt-3 whitespace-pre-wrap text-xl">
            {test.name}
          </article>

          <time className="my-4 block text-sm text-gray-500">
            <TimeText date={test.createdAt} format="h:mm A · D MMM YYYY" />
            <TimeText date={test.startTime} format="YYYY MM D · h:mm" />
            <TimeText date={test.dueTime} format="YYYY MM D · h:mm" />
          </time>

          <Separator />
          <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
            <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <MessageCircle size={20} className="-scale-x-100" />
            </button>
          </div>
          <Separator />

        </div>
        
      </div>
    </>
  );
}
