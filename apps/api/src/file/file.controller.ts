import { Body, Controller, Get, Post } from "@nestjs/common";
import { FileService } from "./file.service";
import {
  uploadFilesBodySchema,
  type UploadFilesBody,
} from "@dropin/contracts/storage";
import { CurrentUser } from "../auth/decorator/current-user.decorator";
import type { JwtPayload } from "../auth/types/jwt";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("")
  async createFile(
    @Body({ schema: uploadFilesBodySchema }) dto: UploadFilesBody,
    @CurrentUser() currentUser: JwtPayload
  ) {
    return await this.fileService.createFile(dto, currentUser);
  }

  @Get("")
  async getFiles(@CurrentUser() currentUser: JwtPayload) {
    return await this.fileService.getFiles(currentUser);
  }
}
