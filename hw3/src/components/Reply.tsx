import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";
import TimeText from "./TimeText";
import { cn } from "@/lib/utils";

type ReplyProps = {
  authorName: string;
  authorHandle: string;
  name: string;
  createdAt: Date;
};

export default function Reply({
  authorName,
  authorHandle,
  name,
  createdAt,
}: ReplyProps) {
  return (
    <>
      <div className="flex gap-4 mt-4 mb-4 ml-4">
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
              <TimeText date={createdAt} format="YYYY-MM-D · h:mm A" />
            </time>
          </p>
          {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
          <article className={cn("mt-2 whitespace-pre-wrap")}>{name}</article>
        </article>
      </div>
      <Separator />
    </>
  );
}