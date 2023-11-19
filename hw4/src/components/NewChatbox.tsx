"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useChatbox from "@/hooks/useChatbox";
import useUserInfo from "@/hooks/useUserInfo";

export default function NewChatbox() {
  const { username } = useUserInfo();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { postNewChatbox, loading } = useChatbox();
  if (!username) return false;

  const handleSave = () => {
    try {
        postNewChatbox({
        user1: username,
        user2: username
      });
      setDialogOpen(false);
      return true;
    } catch (e) {
      console.error(e);
      alert("Error adding chatbox");
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}> 新增聊天室 </Button>
      
      <Dialog open={dialogOpen} onOpenChange={handleClose}>

        <DialogContent className="sm:max-w-[425px]">

          <DialogHeader>
            <DialogTitle> 是否新增聊天室？ </DialogTitle>
          </DialogHeader>


          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}> 確定新增 </Button>
            <Button onClick={handleClose} disabled={loading}> 取消新增 </Button>
          </DialogFooter>

        </DialogContent>

      </Dialog>
    </>
  );
}