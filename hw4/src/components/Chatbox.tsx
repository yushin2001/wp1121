import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";
import TimeText from "./TimeText";

type ChatboxProps = {
  username?: string;
  id: number;
  theOther: string | null;
  createdAt: Date | null;
  content: string | null;
};
export default function Chatbox({
  username,
  id,
  theOther,
  createdAt,
  content
}: ChatboxProps) {
  return (
    <>
      <Separator />
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/chatbox/${id}`,
          query: {
            username
          },
        }}
      >
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAvatar(theOther)}
            alt="avatar"
            className="h-12 w-12 rounded-full"
          />
          <article className="flex grow flex-col">
            <p className="font-bold">
              {theOther}
              <time className="ml-2 font-normal text-gray-400">
                <TimeText date={createdAt} format="YYYY-MM-D · h:mm A" />
              </time>
            </p>
            {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
            <article className="mt-2 whitespace-pre-wrap">{content}</article>
          </article>
        </div>
      </Link>
      <Separator />
    </>
  );
}