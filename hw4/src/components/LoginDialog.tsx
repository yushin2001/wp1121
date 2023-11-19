"use client";

import { useEffect, useRef, useState } from "react";
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
import { cn, validateUsername, validatePassword } from "@/lib/utils";

export default function NameDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);


  useEffect(() => {
    const username = searchParams.get("username");
    setDialogOpen(!validateUsername(username));
  }, [searchParams]);


  const handleSave = () => {
    const username = usernameInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    const newUsernameError = !validateUsername(username);
    setUsernameError(newUsernameError);
    const newPasswordError = !validatePassword(password);
    setPasswordError(newPasswordError);
    if (newUsernameError || newPasswordError) {
      return false;
    }
    const params = new URLSearchParams(searchParams);
    params.set("username", username!);
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
          <DialogTitle>Welcome to Chat!</DialogTitle>
          <DialogDescription>
            Tell us your name to start.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              使用者名稱
            </Label>
            <Input
              placeholder="Input username"
              defaultValue={searchParams.get("username") ?? ""}
              className={cn(usernameError && "border-red-500", "col-span-3")}
              ref={usernameInputRef}
            />
            {usernameError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid username, use only{" "}
                <span className="font-mono">[a-z0-9 ]</span>, must be between 1
                and 50 characters long.
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              密碼
            </Label>
            <Input
              placeholder="Input password"
              defaultValue={searchParams.get("username") ?? ""}
              className={cn(passwordError && "border-red-500")}
              ref={passwordInputRef}
            />
            {passwordError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid password, use only{" "}
                <span className="font-mono">[a-z0-9\._-]</span>, must be between
                1 and 25 characters long.
              </p>
            )}
          </div>

        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}