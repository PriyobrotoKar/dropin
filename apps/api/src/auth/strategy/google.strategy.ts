import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, type Profile } from "passport-google-oauth20";
import { AppConfigService } from "../../config/config.service";
import type { JwtPayload } from "../types/jwt";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: AppConfigService) {
    super({
      clientID: config.get("GOOGLE_CLIENT_ID"),
      clientSecret: config.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: config.get("GOOGLE_CALLBACK_URL"),
      scope: ["profile", "email"],
    });
  }

  validate(_: string, __: string, profile: Profile): Omit<JwtPayload, "id"> {
    const { name, emails, photos } = profile;

    const email = emails?.[0]?.value;
    const profilePicture = photos?.[0]?.value;

    if (!email || !name || !profilePicture) {
      throw new Error("Invalid Google profile");
    }

    const user = {
      email,
      name: `${name.givenName} ${name.familyName}`,
      image: profilePicture,
    };

    return user;
  }
}
