import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { type JwtPayload } from "../types/jwt";
import { AppConfigService } from "../../config/config.service";
import { CookieService } from "../cookie.service.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: AppConfigService, cookies: CookieService) {
    super({
      jwtFromRequest: (req) => cookies.extractAccessToken(req),
      secretOrKey: configService.get("JWT_SECRET"),
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
