import { getSession } from "@/features/auth/lib/session";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  beforeLoad: async () => {
    const token = await getSession();
    if (token) {
      throw redirect({
        to: "/home",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
