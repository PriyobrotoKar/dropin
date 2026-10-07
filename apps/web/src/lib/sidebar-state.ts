import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getSidebarState = createServerFn()
  .validator((data: { name: string }) => data)
  .handler(({ data }): boolean => {
    const state = getCookie(data.name);
    return state === "true";
  });
