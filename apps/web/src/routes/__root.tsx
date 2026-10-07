import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "@dropin/ui/globals.css?url";
import { NotFound } from "@/components/not-found";
import { Toaster } from "@dropin/ui/components/toast";
import { UploadsProvider } from "@/features/upload/uploads-context";
import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "@/features/auth/lib/session";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: Session | null;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="">
      <head>
        <HeadContent />
      </head>
      <body>
        <UploadsProvider>
          {children}
          <Toaster />
        </UploadsProvider>
        <Scripts />
      </body>
    </html>
  );
}
