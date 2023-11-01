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
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function NewActivity() {
  const { handle } = useUserInfo();

  const [dialogOpen, setDialogOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [nameError, setNameError] = useState(false);
  const [startError, setStartError] = useState(false);
  const [dueError, setDueError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  // 儲存新增的活動
  const { postActivity, loading } = useActivity();

  const handleSave = () => {
    const name = nameInputRef.current?.value;
    const start = startValue.toDate();
    const due = dueValue.toDate();

    const newnameError = !validateName(name);
    const newstartError = !validatestartTime(start);
    const newdueError = !validatedueTime(due);
    const newtimeError = !validateTime(start, due);
    setNameError(newnameError);
    setStartError(newstartError);
    setDueError(newdueError);
    setTimeError(newtimeError);

    if (newnameError || newstartError || newdueError || timeError) {
      return false;
    }
    if (!handle) return false;
    if (!name) return false;
    else{
      try {
        postActivity({
          handle,
          name: name,
          startTime: start,
          dueTime: due
        });
      } catch (e) {
        console.error(e);
        alert("Error posting activity");
      }
      setDialogOpen(false);
      return true;
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  // Date
  const [startValue, setStartValue] = useState<Dayjs>(dayjs('2023-11-01T00:00'));
  const [dueValue, setDueValue] = useState<Dayjs>(dayjs('2023-11-05T00:00'));

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
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimeField
                    label = "select start time"
                    value = {startValue}
                    onChange = {() => setStartValue(startValue)}
                    format="L HH"
                    disablePast = {true}
                  />
                </DemoContainer>
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
                <DemoContainer components = {['DateTimePicker']}>
                  <DateTimeField
                    label = "select due time"
                    value = {dueValue}
                    onChange = {() => setDueValue(dueValue)}
                    format="L HH"
                    disablePast = {true}
                  />
                </DemoContainer>
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