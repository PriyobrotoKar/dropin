import { createColumnHelper } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { type DataTableFeatures } from "./features";
import { formatBytes } from "@/hooks/use-file-upload";
import { Checkbox } from "@dropin/ui/components/checkbox";
import { cn } from "@dropin/ui/lib/utils";
import type { GetFilesResponse } from "@dropin/contracts/file";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@dropin/ui/components/avatar";
import { getFileIcon } from "@/lib/file-icon";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<
  DataTableFeatures,
  GetFilesResponse[number]
>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    meta: { className: "w-px" },
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  }),
  columnHelper.accessor("name", {
    header: "File name",
    cell: ({ getValue, row }) => {
      const { type } = row.original;
      const { Icon, colorVar } = getFileIcon(type);

      return (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-sm border border-(--icon)/20 bg-(--icon)/10",
              colorVar
            )}
          >
            <Icon className={"size-4 text-(--icon)"} />
          </span>
          <span>{getValue()}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Date uploaded",
    cell: ({ getValue }) => {
      const date = getValue();
      return format(date, "d MMM y");
    },
  }),
  columnHelper.accessor("updatedAt", {
    header: "Modified",
    cell: ({ getValue }) => {
      const date = getValue();
      return formatDistanceToNow(date, { addSuffix: true });
    },
  }),
  columnHelper.accessor("size", {
    header: "File size",
    cell: ({ getValue }) => {
      const size = getValue();
      return formatBytes(size);
    },
  }),
  columnHelper.accessor("owner", {
    header: "File owner",
    cell: ({ getValue }) => {
      const owner = getValue();
      return (
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src={owner.image ?? ""} alt={owner.name} />
            <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{owner.name}</span>
        </div>
      );
    },
  }),
]);
