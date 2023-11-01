"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function TestPop() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleClose = () => {
        setDialogOpen(false);
    };

    return(
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

                <DialogFooter>
                    <Button onClick={handleClose}> 新增 </Button>
                </DialogFooter>

                </DialogContent>

            </Dialog>
        </>
    );
}