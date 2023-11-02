import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useATest() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postTest = async ({
    handle,
    name,
    replyToActivityId,
    startTime,
    dueTime
  }: {
    handle: string;
    name: string;
    replyToActivityId?: number;
    startTime?: string,
    dueTime?: string
  }) => {
    setLoading(true);

    const res = await fetch("/api/tests", {
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
    postTest,
    loading,
  };
} 