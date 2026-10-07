import { getFileIcon } from "@/lib/file-icon";
import { getSidebarState as getSidebarStateFn } from "@/lib/sidebar-state";
import { useFileSelector } from "@/providers/file-selector-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@dropin/ui/components/avatar";
import { Button } from "@dropin/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarSeparator,
  useSidebar,
} from "@dropin/ui/components/sidebar";
import { cn } from "@dropin/ui/lib/utils";
import {
  IconLayoutSidebarRight,
  IconLayoutSidebarRightFilled,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function DetailsSidebarProvider({
  children,
  ...props
}: React.ComponentProps<typeof SidebarProvider>) {
  const { data } = useQuery({
    queryKey: ["details_sidebar_state"],
    queryFn: () =>
      getSidebarStateFn({ data: { name: "details_sidebar_state" } }),
  });

  console.log(data);

  return (
    <SidebarProvider
      name="details_sidebar_state"
      defaultOpen={data ?? false}
      {...props}
    >
      {children}
    </SidebarProvider>
  );
}

export function DetailsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { setOpen } = useSidebar();

  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      variant="sidebar"
      className="absolute h-full *:data-[slot=sidebar-inner]:bg-background"
      {...props}
    >
      <SidebarHeader className="p-4">
        <div className="flex justify-between">
          <div className="font-heading text-lg font-medium text-foreground">
            Details
          </div>
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={() => {
              console.log("Close sidebar details");
              setOpen(false);
            }}
          >
            <IconX />
          </Button>
        </div>

        <FileDetails />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="p-4">
        <FileProperties />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}

export function DetailsSidebarTrigger() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={toggleSidebar}
      className={cn("", open && "bg-accent")}
    >
      {open ? <IconLayoutSidebarRightFilled /> : <IconLayoutSidebarRight />}
    </Button>
  );
}

function FileDetails() {
  const { selectedFiles } = useFileSelector();

  if (!selectedFiles.length) return null;

  const [file] = selectedFiles;
  const { Icon, colorVar } = getFileIcon(file.type);

  return (
    <div className="contents">
      <div className="flex aspect-16/10 items-center justify-center rounded-md bg-muted text-neutral-400">
        <Icon className="size-12" />
      </div>

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center self-start rounded-sm border border-(--icon)/20 bg-(--icon)/10 text-(--icon)",
            colorVar
          )}
        >
          <Icon />
        </div>

        <div className="min-w-0">
          <h3 className="font-heading leading-tight font-medium wrap-break-word">
            {file.name}
          </h3>
        </div>
      </div>
    </div>
  );
}

function FileProperties() {
  const { selectedFiles } = useFileSelector();

  if (!selectedFiles.length) return null;

  const [file] = selectedFiles;
  const { type } = getFileIcon(file.type);

  return (
    <div className="space-y-3">
      <h3 className="font-heading font-medium">Property</h3>
      <div className="space-y-3">
        <PropertyRow property="Type" value={type} />
        <PropertyRow
          property="Owner"
          value={
            <div className="flex items-center gap-1.5">
              <Avatar size="xs">
                <AvatarImage
                  src={file.owner.image ?? ""}
                  alt={file.owner.name}
                />
                <AvatarFallback>{file.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="truncate">{file.owner.name}</span>
            </div>
          }
        />
        <PropertyRow
          property="Modified"
          value={format(file.updatedAt, "d MMM y")}
        />
        <PropertyRow
          property="Date uploaded"
          value={format(file.createdAt, "d MMM y")}
        />
      </div>
    </div>
  );
}

interface PropertyRowProps {
  property: string;
  value: string | React.ReactNode;
}

function PropertyRow({ property, value }: PropertyRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{property}</span>
      <span>{value}</span>
    </div>
  );
}
