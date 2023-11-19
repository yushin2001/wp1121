import { redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import ReplyinChatbox from "@/components/ReplyinChatbox";
import Reply from "@/components/Reply";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { messagesTable, chatboxesTable } from "@/db/schema";

type ChatboxPageProps = {
  params: {
    chatboxId: string;
  };
  searchParams: {
    username: string;
  };
};

export default async function ChatboxPage({
  params: { chatboxId },
  searchParams: { username },
}: ChatboxPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    redirect(`/?${params.toString()}`);
  };
  const chatbox_id_num = parseInt(chatboxId);
  if (isNaN(chatbox_id_num)) {
    errorRedirect();
  }

  const [ChatboxData] = await db
  .select({
    user1: chatboxesTable.user1,
    user2: chatboxesTable.user2
  })
  .from(chatboxesTable)
  .where(eq(chatboxesTable.id, chatbox_id_num))
  .execute();

  const messages = await db
  .select({
    id: messagesTable.id,
    sender: messagesTable.sendername,
    receiver: messagesTable.receivername,
    content: messagesTable.content,
    createdAt: messagesTable.createdAt
  })
  .from(messagesTable)
  .where(eq(messagesTable.chatboxId, chatboxId))
  .orderBy(asc(messagesTable.createdAt))
  .execute();

  const the_other = (username == ChatboxData.user1)? ChatboxData.user2 : ChatboxData.user1;

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col pt-2">

        <div className="flex flex-col px-4 pt-3">

          <h2 className="text-xl font-bold bg-brand/10 rounded-md p-3 mt-2 mb-2"> Chatbox </h2>

          <Separator />

        </div>

        {messages.map((message) => (
          <Reply
            key={message.id}
            authorName={message.sender}
            content={message.content}
            createdAt={message.createdAt!}
          />
        ))}

        <Separator />
        
        <ReplyinChatbox chatboxId={Number(chatboxId)} replyToUsername={the_other} />

      </div>
    </>
  );
}