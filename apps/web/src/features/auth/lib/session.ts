import { createServerFn } from "@tanstack/react-start";
import { decodeJwt } from "jose";
import { getRequestHeader } from "@tanstack/react-start/server";

export type Session = {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

const SESSION_COOKIE = "access_token";

export const getSession = createServerFn().handler((): Session | null => {
  const header = getRequestHeader("Cookie");
  if (!header) return null;
  for (const part of header.split(/;\s*/)) {
    // Split only on the FIRST '=' — signed/base64 values often contain '='.
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) === SESSION_COOKIE) {
      const token = part.slice(eq + 1);
      const user = decodeJwt<Session["user"]>(token);
      return { user, access_token: token };
    }
  }
  return null;
});
