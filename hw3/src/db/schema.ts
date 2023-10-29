import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    handle: varchar("handle", { length: 50 }).notNull().unique(),
    displayName: varchar("display_name", { length: 50 }).notNull(),
  },
  (table) => ({
    handleIndex: index("handle_index").on(table.handle),
  }),
);

export const tweetsTable = pgTable(
  "tweets",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    replyToTweetId: integer("reply_to_tweet_id"),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    replyToAndTimeIndex: index("reply_to_time_index").on(
      table.replyToTweetId,
      table.createdAt,
    ),
  }),
);

export const activitiesTable = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    name: varchar("content", { length: 100 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    replyToTweetId: integer("reply_to_tweet_id"),
    createdAt: timestamp("created_at").default(sql`now()`),
    startTime: timestamp("start_time").notNull(),
    dueTime: timestamp("due_time").notNull()
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    replyToAndTimeIndex: index("reply_to_time_index").on(
      table.replyToTweetId,
      table.createdAt,
    ),
  }),
);

export const likesTable = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, { onDelete: "cascade" }),
    tweetId: integer("tweet_id")
      .notNull()
      .references(() => tweetsTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    tweetIdIndex: index("tweet_id_index").on(table.tweetId),
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // unique constraints: ensure that a user can't like the same tweet twice.
    uniqCombination: unique().on(table.userHandle, table.tweetId),
  }),
);

export const joinsTable = pgTable(
  "joins",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, { onDelete: "cascade" }),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    activityIdIndex: index("activity_id_index").on(table.activityId),
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // unique constraints: ensure that a user can't join the same activity twice.
    uniqCombination: unique().on(table.userHandle, table.activityId),
  }),
);