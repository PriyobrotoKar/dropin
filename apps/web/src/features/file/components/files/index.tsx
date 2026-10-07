import type { GetFilesResponse } from "@dropin/contracts/file";
import { columns } from "./columns";
import { FilesTable } from "./files-table";
import { Button } from "@dropin/ui/components/button";
import { IconFilter, IconLayoutGrid, IconList } from "@tabler/icons-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@dropin/ui/components/toggle-group";
import { useFileSelector } from "@/providers/file-selector-provider";
import { DetailsSidebarTrigger } from "@/components/details-sidebar";

interface FilesProps {
  data: GetFilesResponse;
}

export function Files({ data }: FilesProps) {
  const { setSelectedFiles } = useFileSelector();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <h2 className="font-heading text-base font-medium">My Files</h2>
          <p className="text-sm text-muted-foreground">
            All files and document you have uploaded to dropin
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant={"outline"}>
            <IconFilter /> Filter
          </Button>

          <ToggleGroup defaultValue={["list"]} spacing={0} variant={"outline"}>
            <ToggleGroupItem value="list">
              <IconList />
              List
            </ToggleGroupItem>
            <ToggleGroupItem value="grid">
              <IconLayoutGrid />
              Grid
            </ToggleGroupItem>
          </ToggleGroup>

          <DetailsSidebarTrigger />
        </div>
      </div>

      <FilesTable
        onSelectionChange={setSelectedFiles}
        columns={columns}
        data={data}
      />
    </div>
  );
}
