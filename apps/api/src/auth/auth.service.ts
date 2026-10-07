import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { type Database, users } from "@dropin/db";
import type { JwtPayload } from "./types/jwt";
import { JwtService } from "@nestjs/jwt";
import { DB } from "../database/database.module";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    @Inject(DB) private readonly db: Database
  ) {}

  async googleCallback(user: JwtPayload) {
    this.logger.log(`Processing google callback for email ${user.email}`);

    // check if user exists
    // if not, create a new user
    // if yes, update the user's profile
    //
    const [newUser] = await this.db
      .insert(users)
      .values({
        name: user.name,
        email: user.email,
        image: user.image,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .returning();

    if (!newUser) {
      this.logger.error(
        `Failed to create or update user for email ${user.email}`
      );
      throw new InternalServerErrorException(
        `Failed to login. Please try again later.`
      );
    }

    // create jwt tokens
    const tokens = await this.generateTokens({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
    });

    // return the jwt tokens
    return tokens;
  }

  private async generateTokens(payload: JwtPayload) {
    this.logger.log(`Generating tokens for user ${payload.id}`);

    const accessToken = this.jwt.sign(payload);
    return { accessToken };
  }
}
