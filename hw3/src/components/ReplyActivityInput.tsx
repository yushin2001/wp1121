"use client";

import { useRef } from "react";
import GrowingTextarea from "@/components/GrowingTextarea";
import UserAvatar from "@/components/UserAvatar";
import useActivity from "@/hooks/useActivity";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

type ReplyActivityInputProps = {
  activityId: number;
  replyToHandle: string;
  attend: boolean;
};

export default function ReplyInput({
  activityId,
  replyToHandle,
  attend
}: ReplyActivityInputProps) {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postActivity, loading } = useActivity();
  const reply_activity = activityId;

  const handleReply = async () => {
    const name = textareaRef.current?.value;
    if (!name) return;
    if (!handle) return;
    try {
      await postActivity({
        name: name,
        handle: handle,
        replyToActivityId: reply_activity
      });
      textareaRef.current.value = "";
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Must be between 1 and 80 characters long.");
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

        {attend && (
          <GrowingTextarea
            ref={textareaRef}
            wrapperClassName="col-start-2 row-start-2"
            className="bg-transparent text-base outline-none placeholder:text-gray-400"
            placeholder="輸入留言"
            attend={attend}
            handleReply={handleReply}
          />
        )}
        {!attend && (
          <GrowingTextarea
            wrapperClassName="col-start-2 row-start-2"
            className="bg-transparent text-base outline-none placeholder:text-gray-400"
            placeholder="參加活動以加入討論"
            attend={attend}
            handleReply={handleReply}
          />
        )}

      </div>
      <div className="p-4 text-end">
        <button
          className={cn(
            "my-2 rounded-xl bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={handleReply}
          disabled={loading || !attend}
        >
          Reply
        </button>
      </div>
    </div>
  );
}