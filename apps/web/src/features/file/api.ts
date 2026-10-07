import { ApiClient } from "@/lib/api-client";
import {
  createFilesResponseSchema,
  getFilesResponseSchema,
} from "@dropin/contracts/file";
import { type UploadFilesBody } from "@dropin/contracts/storage";

export class FileController {
  private static readonly apiClient = new ApiClient("/file");

  static async uploadFiles(data: UploadFilesBody) {
    return this.apiClient.post("", data, createFilesResponseSchema);
  }

  static async getFiles() {
    return this.apiClient.get("", getFilesResponseSchema);
  }
}
