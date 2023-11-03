import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";
import TimeText from "./TimeText";

type ReplyProps = {
  authorName: string;
  authorHandle: string;
  content: string;
  createdAt: Date;
};

export default function Reply({
  authorName,
  authorHandle,
  content,
  createdAt,
}: ReplyProps) {
  return (
    <>
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
                <TimeText date={createdAt} format="YYYY-MM-D · h:mm A" />
              </time>
            </p>
            {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
            <article className="mt-2 whitespace-pre-wrap">{content}</article>
          </article>
        </div>
      <Separator />
    </>
  );
}