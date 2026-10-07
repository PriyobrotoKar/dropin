import { ApiClient } from "@/lib/api-client";
import z from "zod";

export class AuthController {
  private static readonly apiClient = new ApiClient("/auth");

  static async logout() {
    await this.apiClient.post("/logout", {}, z.unknown());
  }
}
