import { mutationOptions } from "@tanstack/react-query";
import { AuthController } from "./api";

export const logoutMutationOptions = mutationOptions({
  mutationFn: async () => AuthController.logout(),
});
