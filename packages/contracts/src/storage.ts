import z from "zod";
import { fileSchema } from "./entities/file";

const localFileSchema = fileSchema
  .extend({ id: z.string() })
  .pick({ id: true, name: true, size: true, type: true });

export const uploadFilesBodySchema = z.object({
  files: z.array(localFileSchema),
});

export const uploadFilesResponseSchema = z.object({
  uploadUrls: z.array(
    localFileSchema.pick({ id: true }).extend({ url: z.url() })
  ),
});

export type UploadFilesBody = z.infer<typeof uploadFilesBodySchema>;
export type UploadFilesResponse = z.infer<typeof uploadFilesResponseSchema>;
