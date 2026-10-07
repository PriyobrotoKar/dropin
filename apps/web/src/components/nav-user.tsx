"use client";

import { logoutMutationOptions } from "@/features/auth/queries";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@dropin/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dropin/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@dropin/ui/components/sidebar";
import {
  IconBell,
  IconChevronRight,
  IconCreditCard,
  IconLogout,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";

export function NavUser() {
  const router = useRouter();
  const { session } = useRouteContext({
    from: "/(dashboard)",
  });
  const { isMobile } = useSidebar();
  const logoutMutation = useMutation({
    ...logoutMutationOptions,
    onSuccess: () => {
      router.invalidate();
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={session.user.image ?? ""}
                alt={session.user.name}
              />
              <AvatarFallback className="rounded-lg">
                {session.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session.user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </span>
            </div>
            <IconChevronRight className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            // className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm font-normal">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session.user.image ?? ""}
                  alt={session.user.name}
                />
                <AvatarFallback className="rounded-lg">
                  {session.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session.user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconSparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUser />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconBell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => logoutMutation.mutate()}
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
