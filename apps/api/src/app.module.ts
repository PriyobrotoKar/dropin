import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigModule } from "./config/config.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guard/jwt.guard";
import { StorageModule } from './storage/storage.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, AuthModule, StorageModule, FileModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
