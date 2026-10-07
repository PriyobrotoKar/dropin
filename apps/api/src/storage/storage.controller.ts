import { Body, Controller, Post } from "@nestjs/common";
import {
  uploadFilesBodySchema,
  type UploadFilesBody,
} from "@dropin/contracts/storage";
import { StorageService } from "./storage.service";
import { CurrentUser } from "../auth/decorator/current-user.decorator";
import type { JwtPayload } from "../auth/types/jwt";

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("upload")
  async uploadFiles(
    @Body({ schema: uploadFilesBodySchema }) dto: UploadFilesBody,
    @CurrentUser() currentUser: JwtPayload
  ) {
    return this.storageService.uploadFiles(dto, currentUser);
  }
}
