import { relations } from "drizzle-orm";
import {
  index,
  text,
  pgTable,
  serial,
  uuid,
  varchar,
  unique,
  integer,
  primaryKey
} from "drizzle-orm/pg-core";

// Checkout the many-to-many relationship in the following tutorial:
// https://orm.drizzle.team/docs/rqb#many-to-many

export const usersTable = pgTable(
  "users",
  {
    username: varchar("username", { length: 100 }).notNull().unique().primaryKey(),
    hashedPassword: varchar("hashed_password", { length: 100 }).notNull(),
    provider: varchar("provider", { length: 100 }).notNull().default("credentials"),
  },
  (table) => ({
    displayUsernameIndex: index("display_username_index").on(table.username)
  }),
);

/*
export const usersRelations = relations(usersTable, ({ many }) => ({
	chatboxTable: many(chatboxTable),
}));

export const chatboxTable = pgTable(
    "chatbox",
    {
        user1: integer('user1_username')
        .notNull()
        .references(() => usersTable.username, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
        user2: integer("user2_username")
        .notNull()
        .references(() => usersTable.username, {
          onDelete: "cascade",
          onUpdate: "cascade",
        }),
    }, (t) => ({
		pk: primaryKey(t.userId, t.groupId),
	}),
);

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    chatboxid: uuid("chatbox_id")
    .notNull()
    .references(() => chatboxTable.pk, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    content: varchar("content", { length: 500 }).notNull()
  }
);
*/


/*

-- many to many
1 user -> many chatboxes
1 chatbox -> 2(many) users

-- one to many
1 chatbox -> many messages
1 messgae -> 1 chatbox
1 user -> many messages
1 message -> 1 user

*/