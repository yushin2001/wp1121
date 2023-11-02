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
import { cn, validatestartTime, validatedueTime, validateName, validateTime } from "@/lib/utils";
import useActivity from "@/hooks/useActivity";
import useUserInfo from "@/hooks/useUserInfo";

export default function NewActivity() {
  const { handle } = useUserInfo();

  const [dialogOpen, setDialogOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const dueTimeInputRef = useRef<HTMLInputElement>(null);
  const [nameError, setNameError] = useState(false);
  const [startError, setStartError] = useState(false);
  const [dueError, setDueError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  // 儲存新增的活動
  const { postActivity, loading } = useActivity();

  const handleSave = () => {
    const name = nameInputRef.current?.value;
    const start = startTimeInputRef.current?.value;
    const due = dueTimeInputRef.current?.value;

    const newnameError = !validateName(name);
    const newstartError = !validatestartTime(start);
    const newdueError = !validatedueTime(due);
    const newtimeError = !validateTime(start, due);

    setNameError(newnameError);
    setStartError(newstartError);
    setDueError(newdueError);
    setTimeError(newtimeError);

    if (newnameError || newstartError || newdueError || newtimeError) {
      return false;
    }
    if (!handle) return false;
    if (!name) return false;
    if (!start) return false;
    if (!due) return false;
    const startdate = new Date(start+":00");
    const duedate = new Date(due+":00");
    try {
      postActivity({
        handle: handle,
        name: name,
        startTime: startdate,
        dueTime: duedate
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
              新增活動名稱、開始日期時間、結束日期時間。
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

            <div className = "grid grid-cols-4 items-center gap-4">
              <Label htmlFor = "name" className = "text-right">
                From
              </Label>
              <div className = "col-span-3 flex items-center gap-2">
                <Input
                  placeholder = "YYYY-MM-DD HH"
                  className = {cn(startError && "border-red-500", "col-span-3")}
                  ref = {startTimeInputRef}
                />
              </div>
              {startError && (
                <p className = "col-span-3 col-start-2 text-xs text-red-500">
                  Invalid start time.
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                To
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  placeholder = "YYYY-MM-DD HH"
                  className = {cn(startError && "border-red-500", "col-span-3")}
                  ref = {dueTimeInputRef}
                />
              </div>
              {dueError && (
                <p className="col-span-3 col-start-2 text-xs text-red-500">
                  Invalid due time.
                </p>
              )}
              {timeError && (
                <p className="col-span-3 col-start-2 text-xs text-red-500">
                  start time need to be earlier than end time, and differ by up to 7 days.
                </p>
              )}
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