import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "./config.schema";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends keyof Env>(propertyPath: T): Env[T] {
    return this.configService.get<Env>(propertyPath, { infer: true });
  }
}
