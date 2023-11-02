// 顯示於主頁面

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";
import JoinButton from "./JoinButton";
import TimeText from "./TimeText";

type ActivityProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  authorHandle: string;
  name: string;
  joins: number;
  joined?: boolean;
  createdAt: Date;
};

export default function Activity({
  username,
  handle,
  id,
  authorName,
  authorHandle,
  name,
  joins,
  joined,
  createdAt,
}: ActivityProps) {
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/activity/${id}`,
          query: {
            username,
            handle,
          },
        }}
      >
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAvatar(authorName)}
            alt="avatar"
            className="h-12 w-12 rounded-full"
          />
          <article className="flex grow flex-col">
            <p className="font-bold">
              {authorName}
              <span className="ml-2 font-normal text-gray-400">
                @{authorHandle}
              </span>
              <time className="ml-2 font-normal text-gray-400">
                <TimeText date={createdAt} format="YYYY MM D · h:mm A" />
              </time>
            </p>
            {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
            <article className="mt-2 whitespace-pre-wrap">{name}</article>
            <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
              <JoinButton
                initialJoins={joins}
                initialJoined={joined}
                activityId={id}
                handle={handle}
              />
            </div>
          </article>
        </div>
      </Link>
      <Separator />
    </>
  );
}