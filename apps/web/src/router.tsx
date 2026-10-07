import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
  MutationCache,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { toast } from "@dropin/ui/components/toast";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        let errorMsg = error.message;
        console.error(error.message);
        if (mutation.meta?.errorMessage) {
          errorMsg = mutation.meta.errorMessage;
        }
        toast.add({
          type: "error",
          description: errorMsg,
        });
      },
    }),
  });

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      errorMessage?: string;
      successMessage?: string;
    };
  }
}
