import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useActivity() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    startTime?: Date;
    dueTime?: Date;
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

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    postActivity,
    loading,
  };
} 