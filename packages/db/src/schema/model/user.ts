import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.text("name").notNull(),
  email: t.varchar("email", { length: 255 }).notNull().unique(),
  image: t.text("image"),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
