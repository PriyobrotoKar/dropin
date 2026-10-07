import { mutationOptions } from "@tanstack/react-query";
import { StorageController } from "./api";
import type { FileWithPreview } from "@/hooks/use-file-upload";

export const uploadFilesMutationOptions = mutationOptions({
  mutationFn: async (data: FileWithPreview[]) =>
    StorageController.uploadFiles({
      files: data.map((f) => ({
        id: f.id,
        name: f.file.name,
        size: f.file.size,
        type: f.file.type,
      })),
    }),
});
