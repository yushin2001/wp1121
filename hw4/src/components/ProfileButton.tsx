"use client";

import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import useUserInfo from "@/hooks/useUserInfo";
import { Button } from "@/components/ui/button";

export default function ProfileButton() {
  const { username, handle } = useUserInfo();
  const router = useRouter();

  return (
    <div className="flex items-center gap-5 text-start transition-colors duration-300">
      <UserAvatar />
      <div className="w-30 max-lg:hidden">
        <p className="text-sm font-bold">{username ?? "..."}</p>
        <p className="text-sm text-gray-500">{`@${handle}`}</p>
      </div>
      <Button onClick={() => router.push("/")}> 切換使用者 </Button>
    </div>
  );
}