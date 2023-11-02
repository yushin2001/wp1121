"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import { Heart } from "lucide-react";

import useJoin from "@/hooks/useJoin";
import { cn } from "@/lib/utils";

type JoinButtonProps = {
  initialJoins: number;
  initialJoined?: boolean;
  activityId: number;
  handle?: string;
};

export default function LikeButton({
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
        "flex w-16 items-center gap-1 hover:text-brand",
        joined && "text-brand",
      )}
      onClick={handleClick}
      disabled={loading}
    >

      <div
        className={cn(
          "flex items-center gap-1 rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10",
          joined && "bg-brand/10",
        )}>
        <Heart size={20} />
      </div>

      {joinsCount > 0 && joinsCount}

    </button>
  );
}