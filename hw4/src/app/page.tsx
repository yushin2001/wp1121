import { eq, or, desc } from "drizzle-orm";
import NameDialog from "@/components/NameDialog";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { usersTable, chatboxesTable, messagesTable } from "@/db/schema";
import ProfileButton from "@/components/ProfileButton";
import Chatbox from "@/components/Chatbox";
import SearchBoxButton from "@/components/SearchBoxButton";

type HomePageProps = {
  searchParams: {
    username: string;
    hashednumber: string
  };
};

export default async function Home({
  searchParams: { username, hashednumber },
}: HomePageProps) {
  if (username && hashednumber) {
    await db
      .insert(usersTable)
      .values({
        username: username,
        hashedpassword: hashednumber
      })
      .onConflictDoUpdate({
        target: usersTable.username,
        set: {
          username: username,
        },
      })
      .execute();
  }

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
      eq(chatboxesTable.user1, username),
      eq(chatboxesTable.user2, username),
    ))
    .leftJoin(messageSubquery, eq(messageSubquery.chatboxId, chatboxesTable.id))
    .orderBy(desc(messagesTable.createdAt))
    .execute();

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">

        <div className="flex w-full flex-row p-3 items-center">
            <ProfileButton />
        </div>

        <Separator />

        <div className="flex w-full flex-row px-3 pt-3 pb-3 items-center gap-4">
          <SearchBoxButton/>
        </div>

        <Separator /> 

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

      <NameDialog />

    </>
  );
}