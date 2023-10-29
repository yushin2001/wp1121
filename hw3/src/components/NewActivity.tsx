// 在主畫面跳出的「新增活動」視窗
"use client";

import { useRef, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, validatestartTime, validatedueTime, validateName } from "@/lib/utils";

export default function NameActivity() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const dueInputRef = useRef<HTMLInputElement>(null);

  const [nameError, setNameError] = useState(false);
  const [startError, setStartError] = useState(false);
  const [dueError, setDueError] = useState(false);


  const handleSave = () => {
    const name = nameInputRef.current?.value;
    const start = startInputRef.current?.value;
    const due = dueInputRef.current?.value;

    const newnameError = !validateName(name);
    const newstartError = !validatestartTime(start);
    const newdueError = !validatedueTime(due);
    setNameError(newnameError);
    setStartError(newstartError);
    setDueError(newdueError);

    if (newstartError || newdueError) {
      return false;
    }

    // when navigating to the same page with different query params, we need to
    // preserve the pathname, so we need to manually construct the url
    // we can use the URLSearchParams api to construct the query string
    // We have to pass in the current query params so that we can preserve the
    // other query params. We can't set new query params directly because the
    // searchParams object returned by useSearchParams is read-only.
    const params = new URLSearchParams(searchParams);
    // validateUsername and validateHandle would return false if the input is
    // invalid, so we can safely use the values here and assert that they are
    // not null or undefined.
    params.set("username", name!);
    router.push(`${pathname}?${params.toString()}`);
    setDialogOpen(false);

    return true;
  };


  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDialogOpen(true);
    } else {
      handleSave() && setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> 新增活動 </DialogTitle>
          <DialogDescription>
            新增活動名稱、開始日期時間、結束日期時間。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              活動名稱
            </Label>
            <Input
              placeholder="名稱"
              defaultValue={searchParams.get("username") ?? ""}
              className={cn(nameError && "border-red-500", "col-span-3")}
              ref={nameInputRef}
            />
            {nameError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid username, use only{" "}
                <span className="font-mono">[a-z0-9 ]</span>, must be between 1
                and 50 characters long.
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              From
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="YYYY-MM-DD HH"
                defaultValue={searchParams.get("handle") ?? ""}
                className={cn(startError && "border-red-500")}
                ref={startInputRef}
              />
            </div>
            {startError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid handle, use only{" "}
                <span className="font-mono">[a-z0-9\._-]</span>, must be between
                1 and 25 characters long.
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              To
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="YYYY-MM-DD HH"
                defaultValue={searchParams.get("handle") ?? ""}
                className={cn(dueError && "border-red-500")}
                ref={dueInputRef}
              />
            </div>
            {dueError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid handle, use only{" "}
                <span className="font-mono">[a-z0-9\._-]</span>, must be between
                1 and 25 characters long.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}> 新增 </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}