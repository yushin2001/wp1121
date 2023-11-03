"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";
import { CheckCircle } from "lucide-react";
import useJoin from "@/hooks/useJoin";
import { cn } from "@/lib/utils";

type JoinButtonProps = {
  initialJoined?: boolean;
  activityId: number;
  handle?: string;
};

export default function JoinButton({
  initialJoined,
  activityId,
  handle,
}: JoinButtonProps) {
  const [joined, setJoined] = useState(initialJoined);
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
      setJoined(false);
    } else {
      await joinActivity({
        activityId,
        userHandle: handle,
      });
      setJoined(true);
    }
  };

  return (
    <button
      className={cn(
        "flex w-16 items-center gap-1 hover:bg-gray-200 rounded w-fit h-10 p-2 border"
      )}
      onClick={handleClick}
      disabled={loading}
    >

        {joined && (
          <>
            <CheckCircle size={20}  color="green"/>
            <>我已參加</>
          </>
        )}
        {!joined && (
          <>
            <CheckCircle size={20}/>
            <>我想參加</>
        </>
        )}

    </button>
  );
}