"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBoxButton() {
  const handelSearch = () => {
    return true;
  };

  return (
    <div className="flex flex-row items-center gap-4 grid grid-cols-4">
        <Input
        placeholder = "搜尋想參加的活動"
        className="col-span-3"
        />
        <Button onClick={handelSearch} >
            查詢
        </Button>
    </div>
  );
}