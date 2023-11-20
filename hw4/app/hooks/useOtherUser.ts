import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserName = session.data?.user?.name;

    const otherUser = conversation.users.filter((user) => user.name !== currentUserName);

    return otherUser[0];
  }, [session.data?.user?.name, conversation.users]);

  return otherUser;
};

export default useOtherUser;