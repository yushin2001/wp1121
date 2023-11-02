import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";
import TimeText from "./TimeText";

type TestProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  authorHandle: string;
  name: string;
  createdAt: Date;
  startTime: Date;
  dueTime: Date;
};

export default function Activity({
  username,
  handle,
  id,
  authorName,
  authorHandle,
  name,
  createdAt,
  startTime,
  dueTime
}: TestProps) {
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/test/${id}`,
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
                <TimeText date={createdAt} format="h:mm A · D MMM YYYY" />
                <TimeText date={startTime} format="YYYY MM D · h:mm" />
                <TimeText date={dueTime} format="YYYY MM D · h:mm" />
              </time>
            </p>
            {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
            <article className="mt-2 whitespace-pre-wrap">{name}</article>
            <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
              <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
                <MessageCircle size={20} className="-scale-x-100" />
              </button>
            </div>
          </article>
        </div>
      </Link>
      <Separator />
    </>
  );
}