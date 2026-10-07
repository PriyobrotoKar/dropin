import type { UploadFilesBody } from "@dropin/contracts/storage";
import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import type { JwtPayload } from "../auth/types/jwt";
import { DB } from "../database/database.module";
import type { GetFilesResponse } from "@dropin/contracts/file";
import { files, type Database } from "@dropin/db";

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(@Inject(DB) private readonly db: Database) {}

  async createFile(dto: UploadFilesBody, currentUser: JwtPayload) {
    this.logger.log(
      `User ${currentUser.id} requested to create ${dto.files.length} files`
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
      this.logger.log(`Found ${conflicts.length} conflicting files`);
      throw new ConflictException("Files already exist");
    }

    const values = dto.files.map(({ id, ...f }) => ({
      ...f,
      ownerId: currentUser.id,
      key: f.name,
    }));

    const newFiles = await this.db.insert(files).values(values).returning();

    return newFiles;
  }

  async getFiles(currentUser: JwtPayload): Promise<GetFilesResponse> {
    this.logger.log(`User ${currentUser.id} requested to get files`);

    const files = await this.db.query.files.findMany({
      where: {
        ownerId: currentUser.id,
      },
      with: {
        owner: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return files;
  }
}
