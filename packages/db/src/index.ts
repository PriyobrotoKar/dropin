import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "./schema/relations";
export * from "./schema";

export function initializeDb(connectionString: string) {
  const pool = new Pool({
    connectionString,
  });
  return drizzle({ client: pool, relations });
}

export type Database = ReturnType<typeof initializeDb>;
