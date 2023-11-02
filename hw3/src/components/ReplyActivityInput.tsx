"use client";

import { useRef } from "react";

import GrowingTextarea from "@/components/GrowingTextarea";
import UserAvatar from "@/components/UserAvatar";
import useActivity from "@/hooks/useActivity";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

type ReplyActivityInputProps = {
  replyToActivityId: number;
  replyToHandle: string;
};

export default function ReplyInput({
  replyToActivityId,
  replyToHandle,
}: ReplyActivityInputProps) {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postActivity, loading } = useActivity();

  const handleReply = async () => {
    const name = textareaRef.current?.value;
    if (!name) return;
    if (!handle) return;
    try {
      await postActivity({
        handle,
        name,
        replyToActivityId
      });
      textareaRef.current.value = "";
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting reply");
    }
  };

  return (
    <div onClick={() => textareaRef.current?.focus()}>
      <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 px-4 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <UserAvatar className="col-start-1 row-start-2 h-12 w-12" />
        <p className="col-start-2 row-start-1 text-gray-500">
          Replying to <span className="text-brand"> @{replyToHandle} </span>
        </p>
        <GrowingTextarea
          ref={textareaRef}
          wrapperClassName="col-start-2 row-start-2"
          className="bg-transparent text-xl outline-none placeholder:text-gray-400"
          placeholder="Add your reply"
        />
      </div>
      <div className="p-4 text-end">
        <button
          className={cn(
            "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={handleReply}
          disabled={loading}
        >
          Reply
        </button>
      </div>
    </div>
  );
}