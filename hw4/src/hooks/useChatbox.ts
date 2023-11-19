import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function useChatbox() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const postChatbox = async ({
    replyToChatboxId,
    sendername,
    receivername,
    content
  }: {
    replyToChatboxId: number,
    sendername: string,
    receivername: string,
    content: string,
  }) => {
    setLoading(true);
    const res = await fetch("/api/chatboxes", {
      method: "POST",
      body: JSON.stringify({
        replyToChatboxId,
        sendername,
        receivername,
        content
      }),
    });
    if (!(res.status === 200)) {
      setLoading(false);
      const body = await res.json();
      throw new Error(body.error);
    }
    if (replyToChatboxId === undefined){
      params.set("username", sendername!);
      router.push(`/newChatbox/?${params.toString()}`);
    }
    router.refresh();
    setLoading(false);
  };
  
  return {
    postChatbox,
    loading,
  };
}