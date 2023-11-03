"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import { CheckCircle } from "lucide-react";

import useJoin from "@/hooks/useJoin";
import { cn } from "@/lib/utils";

type JoinButtonProps = {
  initialJoins: number;
  initialJoined?: boolean;
  activityId: number;
  handle?: string;
};

export default function JoinButton({
  initialJoins,
  initialJoined,
  activityId,
  handle,
}: JoinButtonProps) {
  const [joined, setJoined] = useState(initialJoined);
  const [joinsCount, setJoinsCount] = useState(initialJoins);
  const { joinActivity, unjoinActivity, loading } = useJoin();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!handle) return;
    if (joined) {
      await unjoinActivity({
        activityId,
        userHandle: handle,
      });
      setJoinsCount((prev) => prev - 1);
      setJoined(false);
    } else {
      await joinActivity({
        activityId,
        userHandle: handle,
      });
      setJoinsCount((prev) => prev + 1);
      setJoined(true);
    }
  };

  return (
    <button
      className={cn(
        "flex w-16 items-center gap-1 hover:bg-gray-200 rounded-full"
      )}
      onClick={handleClick}
      disabled={loading}
    >

        {joined && (
            <CheckCircle size={20}  color="green"/>
        )}
        {!joined && (
            <CheckCircle size={20}/>
        )}

      {joinsCount}人參加

    </button>
  );
}