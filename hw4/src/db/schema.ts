import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  unique,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    username: varchar("username").primaryKey().unique(),
    hashedpassword: varchar("hashed_password", { length: 50 }).notNull(),
  }
);

export const userstochatboxesRelations = relations(usersTable, ({ many }) => ({
  chatboxesTable: many(chatboxesTable),
}));

export const chatboxesTable = pgTable(
  "chatboxes",
  {
    id: serial("id").primaryKey(),
    user1: varchar("user1")
    .notNull()
    .references(() => usersTable.username, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    user2: varchar("user2")
    .notNull()
    .references(() => usersTable.username, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => ({
    uniqCombination: unique().on(table.user1, table.user2),
  }),
);

export const chatboxestomessagesRelations = relations(chatboxesTable, ({ many }) => ({
  messagesTable: many(messagesTable),
}));

export const userstomessagesRelations = relations(usersTable, ({ many }) => ({
  messagesTable: many(messagesTable),
}));

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    chatboxId: varchar("chatbox_id")
      .notNull()
      .references(() => chatboxesTable.id, { onDelete: "cascade" }),
    sendername: varchar("sender_username")
      .notNull()
      .references(() => usersTable.username, { onDelete: "cascade" }),
    receivername: varchar("receiver_username")
      .notNull()
      .references(() => usersTable.username, { onDelete: "cascade" }),
    content: varchar("content").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  },
);