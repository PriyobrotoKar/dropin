import type {
  UploadFilesBody,
  UploadFilesResponse,
} from "@dropin/contracts/storage";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { JwtPayload } from "../auth/types/jwt";
import { DB } from "../database/database.module";
import type { Database } from "@dropin/db";
import { S3Adapter } from "./s3.adapter";

@Injectable()
export class StorageService {
  private logger = new Logger(StorageService.name);

  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly s3: S3Adapter
  ) {}

  async uploadFiles(
    dto: UploadFilesBody,
    currentUser: JwtPayload
  ): Promise<UploadFilesResponse> {
    this.logger.log(
      `User ${currentUser.id} requested to upload ${dto.files.length} files`
    );

    // check if any files conflict with existing files
    const conflicts = await this.db.query.files.findMany({
      where: {
        ownerId: currentUser.id,
        name: { in: dto.files.map((f) => f.name) },
      },
      columns: {
        id: true,
        name: true,
      },
    });

    // if there are conflicts, remove those files from the request body
    if (conflicts.length > 0) {
      dto.files = dto.files.filter(
        (f) => !conflicts.some((c) => c.name === f.name)
      );
    }

    const result: UploadFilesResponse["uploadUrls"] = [];

    for (const file of dto.files) {
      const url = this.s3.generateUploadUrl(file);
      result.push({ id: file.id, url });
    }

    return {
      uploadUrls: result,
    };
  }
}
