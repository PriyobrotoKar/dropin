import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { GoogleStrategy } from "./strategy/google.strategy";
import { CookieService } from "./cookie.service.js";

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, CookieService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
