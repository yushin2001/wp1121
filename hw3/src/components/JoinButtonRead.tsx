"use client";

import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type JoinButtonReadProps = {
  initialJoins: number;
  initialJoined?: boolean;
};

export default function JoinButtonRead({
  initialJoins,
  initialJoined,
}: JoinButtonReadProps) {
  return (
      <div
        className={cn(
          "flex items-center gap-1 rounded-full p-1.5 transition-colors duration-300"
        )}>

        {initialJoined && (
            <CheckCircle size={20}  color="green"/>
        )}
        {!initialJoined && (
            <CheckCircle size={20}/>
        )}

        {(initialJoins === null) && <>0人參加</>}
        {(initialJoins !== null) && <>{initialJoins}人參加</>}
      
      </div>
  );
}