import { redirect } from "next/navigation";
import { eq, desc, and, like, or } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { chatboxesTable, messagesTable } from "@/db/schema";
import ProfileButton from "@/components/ProfileButton";
import Chatbox from "@/components/Chatbox";
import SearchBoxButton from "@/components/SearchBoxButton";
import NewChatbox from "@/components/NewChatbox";
import { cn } from "@/lib/utils";

type SearchResultPageProps = {
  params: {
    keyword: string;
  };
  searchParams: {
    key: string;
    username: string;
    handle?: string;
  };
};

export default async function SearchResultPage({
  params: { keyword },
  searchParams: { username },
}: SearchResultPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    redirect(`/?${params.toString()}`);
  };

  const messageSubquery = db.$with("message").as(
    db
      .select({
        chatboxId: messagesTable.chatboxId,
        content: messagesTable.content,
        sender: messagesTable.sendername,
        receiver: messagesTable.receivername,
        createdAt: messagesTable.createdAt
      })
      .from(messagesTable)
      .orderBy(desc(messagesTable.createdAt))
  );

  const chatboxes = await db
    .with(messageSubquery)
    .select({
      id: chatboxesTable.id,
      sender: messageSubquery.sender,
      receiver: messageSubquery.receiver,
      content: messageSubquery.content,
      createdAt: messageSubquery.createdAt
    })
    .from(chatboxesTable)
    .where(or(
      and(
        like(chatboxesTable.user1, `%${keyword}%`),
        eq(chatboxesTable.user2, username)
      ),
      and(
        like(chatboxesTable.user2, `%${keyword}%`),
        eq(chatboxesTable.user1, username),
      )
    ))
    .leftJoin(messageSubquery, eq(messageSubquery.chatboxId, chatboxesTable.id))
    .orderBy(desc(messagesTable.createdAt))
    .execute();

  
  if (keyword === "") {
    errorRedirect();
  }

  const newChatbox = (chatboxes.length === 0)? true : false;

  return (
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">

        <div className="flex w-full flex-row p-3 items-center">
            <ProfileButton />
        </div>

        <Separator />

        <div className="flex w-full flex-row px-3 pt-3 pb-3 items-center gap-4">
          <SearchBoxButton/>
        </div>

        <Separator />

        <div className={cn("mt-2 whitespace-pre-wrap", "pl-2 pb-2")}>
          <article>關鍵字：{keyword}</article>
        </div>

        {newChatbox?
          <NewChatbox/>
        :
        <></>
        }


        {chatboxes.map((chatbox) => (
          <Chatbox
            key={chatbox.id}
            id={chatbox.id}
            username={username}
            content={chatbox.content}
            createdAt={chatbox.createdAt}
            theOther={(chatbox.receiver == username)? chatbox.sender : chatbox.receiver}
          />
        ))}
      </div>
  );
}