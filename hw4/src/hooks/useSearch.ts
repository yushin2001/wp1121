import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/useUserInfo";
import { useSearchParams } from "next/navigation";

export default function useSearch() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { username } = useUserInfo();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  
  const searchChatbox = async ({
    keyword
  }: {
    keyword?: string;
  }) => {
    setLoading(true); 
    if (keyword === undefined || keyword === "" || keyword === null){
      params.set("username", username!);
      setLoading(false);
      router.push(`/?${params.toString()}`);
    }
    else{
      params.set("username", username!);
      router.push(`/searchresult/${keyword}?${params.toString()}`);
      router.refresh();
      setLoading(false);
    }
  };

  return {
    searchChatbox,
    loading,
  };
}