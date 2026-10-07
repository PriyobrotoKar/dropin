import "reflect-metadata";
import { Logger, StandardSchemaValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { BunAdapter, type NestBunApplication } from "@nestbun/platform";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/config.service";

// Runs directly on Bun.serve() — no Express, no node:http.
const app = await NestFactory.create<NestBunApplication>(
  AppModule,
  new BunAdapter()
);
const port = app.get(AppConfigService).get("PORT");

// NestJS 12 validates any Standard Schema (Zod, Valibot, ArkType) attached via
// @Body({ schema }), @Query({ schema }) or @Param('id', { schema }).
app.useGlobalPipes(new StandardSchemaValidationPipe());
app.enableShutdownHooks();
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true,
});

await app.listen(port);
new Logger("Bootstrap").log(`Listening on ${await app.getUrl()}`);
