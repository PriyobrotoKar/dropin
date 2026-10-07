import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { StorageController } from "./storage.controller";
import { S3Adapter } from "./s3.adapter";

@Module({
  controllers: [StorageController],
  providers: [StorageService, S3Adapter],
})
export class StorageModule {}
