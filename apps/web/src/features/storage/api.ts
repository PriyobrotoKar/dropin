import { ApiClient } from "@/lib/api-client";
import {
  type UploadFilesBody,
  uploadFilesResponseSchema,
} from "@dropin/contracts/storage";

export class StorageController {
  private static readonly apiClient = new ApiClient("/storage");

  static async uploadFiles(data: UploadFilesBody) {
    return this.apiClient.post("/upload", data, uploadFilesResponseSchema);
  }
}
