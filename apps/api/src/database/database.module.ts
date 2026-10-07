import { Global, Module } from "@nestjs/common";
import { initializeDb } from "@dropin/db";
import { AppConfigService } from "../config/config.service";

export const DB = Symbol("DB");

@Global()
@Module({
  providers: [
    {
      provide: DB,
      useFactory: (configService: AppConfigService) => {
        return initializeDb(configService.get("DATABASE_URL"));
      },
      inject: [AppConfigService],
    },
  ],
  exports: [DB],
})
export class DatabaseModule {}
