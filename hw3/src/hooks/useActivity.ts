import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/useUserInfo";
import { useSearchParams } from "next/navigation";

export default function useActivity() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { username } = useUserInfo();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const postActivity = async ({
    handle,
    name,
    replyToActivityId,
    startTime,
    dueTime
  }: {
    handle: string;
    name: string;
    replyToActivityId?: number;
    startTime?: string;
    dueTime?: string;
  }) => {
    setLoading(true);
    const res = await fetch("/api/activities", {
      method: "POST",
      body: JSON.stringify({
        handle,
        name,
        replyToActivityId,
        startTime,
        dueTime
      }),
    });
    if (!(res.status === 200)) {
      setLoading(false);
      const body = await res.json();
      throw new Error(body.error);
    }
    if (replyToActivityId === undefined){
      params.set("username", username!);
      params.set("handle", handle!);
      router.push(`/newactivity/?${params.toString()}`);
    }
    router.refresh();
    setLoading(false);
  };
  
  return {
    postActivity,
    loading,
  };
}