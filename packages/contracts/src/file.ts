import z from "zod";
import { fileSchema } from "./entities/file";
import { userSchema } from "./entities/user";

export const getFilesResponseSchema = z.array(
  fileSchema.extend({ owner: userSchema })
);
export type GetFilesResponse = z.infer<typeof getFilesResponseSchema>;

export const createFilesResponseSchema = z.array(fileSchema);
export type CreateFilesResponse = z.infer<typeof createFilesResponseSchema>;
