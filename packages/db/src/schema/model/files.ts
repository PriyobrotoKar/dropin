import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./user";

export const files = pgTable(
  "files",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.text("name").notNull(),
    type: t.text("type").notNull(),
    size: t.integer("size").notNull(),
    key: t.text("key").notNull(),
    ownerId: t
      .uuid("owner_id")
      .notNull()
      .references(() => users.id),
    createdAt: t
      .timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: t
      .timestamp("updated_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (f) => [t.unique().on(f.ownerId, f.name)]
);

export type File = typeof files.$inferSelect;
