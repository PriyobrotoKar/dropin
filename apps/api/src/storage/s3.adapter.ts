import { Injectable, Logger } from "@nestjs/common";
import { AppConfigService } from "../config/config.service";
import { S3Client } from "bun";
import type { UploadFilesBody } from "@dropin/contracts/storage";

@Injectable()
export class S3Adapter {
  private readonly client: S3Client;
  private readonly logger = new Logger(S3Adapter.name);

  constructor(private readonly config: AppConfigService) {
    this.client = new S3Client({
      accessKeyId: config.get("S3_ACCESS_KEY"),
      secretAccessKey: config.get("S3_SECRET_KEY"),
      endpoint: config.get("S3_ENDPOINT"),
      bucket: config.get("S3_BUCKET"),
    });
  }

  generateUploadUrl(file: UploadFilesBody["files"][number]) {
    this.logger.log(`Generating upload URL for file: ${file.name}`);

    return this.client.presign(file.name, {
      method: "PUT",
      expiresIn: 3600,
      type: file.type,
    });
  }
}
