"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import useSearch from "@/hooks/useSearch"
import useUserInfo from "@/hooks/useUserInfo";

export default function SearchBoxButton(){
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const { searchActivity, loading } = useSearch();
  const { handle } = useUserInfo();

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
    if (!handle) return;
    if (chinese) {
      alert("Keyword must be English.");
      return;
    }
    try{
      searchActivity({
        handle: handle,
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
    if (!handle) return;
    try{
      searchActivity({
        handle: handle,
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
        placeholder = "搜尋想參加的活動"
        className="col-span-2"
        ref = {keywordInputRef}
        />
        <Button onClick={handelSearch} disabled={loading}>
            查詢
        </Button>
        <Button onClick={handelBack} disabled={loading}>
            查看所有活動
        </Button>
    </div>
  );
}