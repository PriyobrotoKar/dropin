import { mutationOptions } from "@tanstack/react-query";
import { FileController } from "./api";
import type { UploadFilesBody } from "@dropin/contracts/storage";

export const createFilesMutationOptions = mutationOptions({
  mutationFn: async (data: UploadFilesBody) => FileController.uploadFiles(data),
});
