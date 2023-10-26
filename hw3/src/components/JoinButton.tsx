"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import { Heart } from "lucide-react";

import useLike from "@/hooks/useLike";
import { cn } from "@/lib/utils";

type JoinButtonProps = {
  initialJoins: number;
  initialJoined?: boolean;
  tweetId: number;
  handle?: string;
};

export default function LikeButton({
  initialJoins,
  initialJoined,
  tweetId,
  handle,
}: JoinButtonProps) {
  const [liked, setLiked] = useState(initialJoined);
  const [likesCount, setLikesCount] = useState(initialJoins);
  const { likeTweet, unlikeTweet, loading } = useLike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, which will cause the page to navigate to the activity page. 
    // So we stop the event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!handle) return;
    if (liked) {
      await unlikeTweet({
        tweetId,
        userHandle: handle,
      });
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await likeTweet({
        tweetId,
        userHandle: handle,
      });
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <button
      className={cn(
        "flex w-16 items-center gap-1 hover:text-brand",
        liked && "text-brand",
      )}
      onClick={handleClick}
      disabled={loading}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10",
          liked && "bg-brand/10",
        )}
      >
        <Heart size={18} />
      </div>
      {likesCount > 0 && likesCount}
    </button>
  );
}