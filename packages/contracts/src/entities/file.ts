import z from "zod";
import type { File as DbFile } from "@dropin/db";
import { isoDate } from "../lib/iso-date";

export const MAX_FILE_SIZE = 500 * 1024 ** 2;

const fileObject = z.object({
  id: z.uuid(),
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE),
  type: z.string(),
  key: z.string(),
  ownerId: z.string(),
  createdAt: isoDate,
  updatedAt: isoDate,
});

// compile-time check only: fails if the schema drifts from the DB type
z.toZod<DbFile>()(fileObject);

export const fileSchema = fileObject;

export type File = z.infer<typeof fileSchema>;
