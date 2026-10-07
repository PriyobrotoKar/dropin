import z from "zod";
import type { User } from "@dropin/db";
import { isoDate } from "../lib/iso-date";

const userObject = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  image: z.url().nullable(),
  createdAt: isoDate,
  updatedAt: isoDate,
});

// compile-time check only: fails if the schema drifts from the DB type
z.toZod<User>()(userObject);

export const userSchema = userObject;
