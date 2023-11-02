// 在主畫面跳出的「新增活動」視窗
"use client";

import { useRef, useState } from "react";

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
import { cn, validateName } from "@/lib/utils";
import useTest from "@/hooks/useTest";
import useUserInfo from "@/hooks/useUserInfo";

export default function NewActivity() {
  const { handle } = useUserInfo();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [nameError, setNameError] = useState(false);
  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const dueTimeInputRef = useRef<HTMLInputElement>(null);

  // 儲存新增的活動
  const { postTest, loading } = useTest();

  const handleSave = () => {
    const name = nameInputRef.current?.value;
    const newnameError = !validateName(name);
    const start = startTimeInputRef.current?.value;
    const due = dueTimeInputRef.current?.value;
    setNameError(newnameError);

    if (newnameError) {
      return false;
    }
    if (!handle) return false;
    if (!name) return false;
    if (!start) return false;
    if (!due) return false;
    try {
      postTest({
        handle: handle,
        name: name,
        startTime: (start + ":00"),
        dueTime: (due + ":00")
      });
      setDialogOpen(false);
      return true;
    } catch (e) {
      console.error(e);
      alert("Error posting activity");
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}> 新增活動 </Button>
      
      <Dialog open={dialogOpen} onOpenChange={handleClose}>

        <DialogContent className="sm:max-w-[425px]">

          <DialogHeader>
            <DialogTitle> 新增活動 </DialogTitle>
            <DialogDescription>
              新增活動名稱。
            </DialogDescription>
          </DialogHeader>

          <div className = "grid gap-4 py-4">
            <div className = "grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                活動名稱
              </Label>
              <Input
                placeholder = "名稱"
                className = {cn(nameError && "border-red-500", "col-span-3")}
                ref = {nameInputRef}
              />
              {nameError && (
                <p className = "col-span-3 col-start-2 text-xs text-red-500">
                  Invalid activity name.
                </p>
              )}
            </div>
          </div>
          <div className = "grid gap-4 py-4">
            <div className = "grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                From
              </Label>
              <Input
                placeholder = "YYYY-MM-DD HH"
                className = {cn("col-span-3")}
                ref = {startTimeInputRef}
              />
            </div>
          </div>
          <div className = "grid gap-4 py-4">
            <div className = "grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                To
              </Label>
              <Input
                placeholder = "YYYY-MM-DD HH"
                className = {cn("col-span-3")}
                ref = {dueTimeInputRef}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}> 新增 </Button>
          </DialogFooter>

        </DialogContent>

      </Dialog>
    </>
  );
}