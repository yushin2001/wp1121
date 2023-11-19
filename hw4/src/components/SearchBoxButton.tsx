"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import useSearch from "@/hooks/useSearch"
import useUserInfo from "@/hooks/useUserInfo";

export default function SearchBoxButton(){
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const { searchChatbox, loading } = useSearch();
  const { username } = useUserInfo();

  function containsChineseCharacters(input: string): boolean {
    const chineseRegExp = /[\u4e00-\u9fa5]/;
    return chineseRegExp.test(input);
  }
  
  const handelSearch = () => {
    const key = (keywordInputRef.current?.value === null) ? "" : keywordInputRef.current?.value;
    if (key === undefined){
      return;
    }
    const chinese = containsChineseCharacters(key);
    if (!username) return;
    if (chinese) {
      alert("Keyword must be English.");
      return;
    }
    try{
      searchChatbox({
        keyword: key,
      });
    }
    catch (e) {
      console.error(e);
      alert("Must be between 1 and 80 characters long.");
    }
    return true;
  };

  const handelBack = () => {
    const key = "";
    if (!username) return;
    try{
      searchChatbox({
        keyword: key,
      });
    }
    catch (e) {
      console.error(e);
      alert("error.");
    }
    return true;
  };

  return (
    <div className="flex flex-row items-center gap-4 grid grid-cols-4">
        <Input
        placeholder = "搜尋聊天室"
        className="col-span-2"
        ref = {keywordInputRef}
        />
        <Button onClick={handelSearch} disabled={loading}>
            查詢
        </Button>
        <Button onClick={handelBack} disabled={loading}>
            查看所有聊天室
        </Button>
    </div>
  );
}