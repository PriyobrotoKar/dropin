import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guard/google.guard";
import type { BunRequest, BunResponse } from "@nestbun/platform";
import type { JwtPayload } from "./types/jwt";
import { CookieService } from "./cookie.service.js";
import { Public } from "./decorator/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookies: CookieService
  ) {}

  @Public()
  @Get("google")
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {}

  @Public()
  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async handleGoogleCallback(
    @Req() { user }: BunRequest & { user: JwtPayload },
    @Res() res: BunResponse
  ) {
    const tokens = await this.authService.googleCallback(user);
    this.cookies.setAuthCookies(res, tokens);
    return res.status(302).redirect("http://localhost:3000/login/success");
  }

  @HttpCode(204)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: BunResponse) {
    this.cookies.clearAuthCookies(res);
  }
}
