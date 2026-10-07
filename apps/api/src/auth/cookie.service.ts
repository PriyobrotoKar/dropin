import { Injectable } from "@nestjs/common";
import type { BunResponse, BunRequest, CookieOptions } from "@nestbun/platform";
import ms, { type StringValue } from "ms";
import { AppConfigService } from "../config/config.service.js";

const ACCESS_TOKEN = "access_token";

@Injectable()
export class CookieService {
  private readonly options: CookieOptions;

  constructor(private readonly config: AppConfigService) {
    this.options = {
      httpOnly: true,
      secure: config.get("NODE_ENV") === "production",
      sameSite: "lax",
      path: "/",
    };
  }

  extractAccessToken(req: BunRequest): string | null {
    const cookies = new Bun.CookieMap(req.headers.cookie);
    return cookies.get(ACCESS_TOKEN) ?? null;
  }

  setAuthCookies(res: BunResponse, tokens: { accessToken: string }) {
    res.cookie(ACCESS_TOKEN, tokens.accessToken, {
      ...this.options,
      maxAge: ms(this.config.get("JWT_EXPIRES_IN") as StringValue),
    });
  }

  clearAuthCookies(res: BunResponse) {
    res.clearCookie(ACCESS_TOKEN, this.options);
  }
}
