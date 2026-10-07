import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { getSession } from "@/features/auth/lib/session";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@dropin/ui/components/sidebar";
import { FileSelectorProvider } from "@/providers/file-selector-provider";
import {
  DetailsSidebar,
  DetailsSidebarProvider,
} from "@/components/details-sidebar";
import { getSidebarState } from "@/lib/sidebar-state";

export const Route = createFileRoute("/(dashboard)")({
  beforeLoad: async ({ context }) => {
    const session = await getSession();
    const detailsSidebarState = await context.queryClient.query({
      queryKey: ["details_sidebar_state"],
      queryFn: () =>
        getSidebarState({ data: { name: "details_sidebar_state" } }),
    });

    console.log("details sidebar state", detailsSidebarState);

    if (!session) {
      throw redirect({
        to: "/login",
      });
    }

    return { session, detailsSidebarState };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider className="h-svh [--header-height:calc(--spacing(16))]">
      <FileSelectorProvider>
        <AppSidebar />
        <SidebarInset className="min-h-0 flex-row overflow-hidden md:rounded-xl md:shadow-sm">
          <DetailsSidebarProvider className="min-h-0 flex-col">
            <Header />
            <div className="relative flex flex-1">
              <SidebarInset>
                <div className="min-h-0 flex-1 p-4">
                  <Outlet />
                </div>
              </SidebarInset>
              <DetailsSidebar />
            </div>
          </DetailsSidebarProvider>
        </SidebarInset>
      </FileSelectorProvider>
    </SidebarProvider>
  );
}
