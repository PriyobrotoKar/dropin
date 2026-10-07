import { createFilesMutationOptions } from "@/features/file/queries";
import { uploadFilesMutationOptions } from "@/features/storage/queries";
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import { Button } from "@dropin/ui/components/button";
import { ButtonGroup } from "@dropin/ui/components/button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@dropin/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dropin/ui/components/dropdown-menu";
import { toast } from "@dropin/ui/components/toast";
import {
  IconChevronDown,
  IconCloudUpload,
  IconFolderUp,
} from "@tabler/icons-react";
import { useUploads } from "@/features/upload/uploads-context";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { getFileIcon } from "@/lib/file-icon";
import { cn } from "@dropin/ui/lib/utils";

export function UploadFilesButton() {
  const router = useRouter();

  const { setFiles } = useUploads();
  const { openFileDialog, getInputProps, uploadToCloud } = useFileUpload({
    onFilesChange: (files) => {
      mutation.mutate(files);
    },
  });

  const createFilesMutation = useMutation(createFilesMutationOptions);

  const mutation = useMutation({
    ...uploadFilesMutationOptions,
    onSuccess: async (data, files) => {
      const ids = data.uploadUrls.map((file) => file.id);
      const validFiles: FileWithPreview[] = files.map((f) => ({
        ...f,
        error:
          f.error ||
          (!ids.includes(f.id) && "File already exists") ||
          undefined,
      }));

      // store the conflict errors so the toast shows them
      setFiles(validFiles);

      const toastId = toast.add({
        description: <UploadProgressToast />,
        data: {
          hideCloseButton: true,
        },
        timeout: 0,
      });

      try {
        await uploadToCloud(data.uploadUrls, validFiles);
        await createFilesMutation.mutateAsync({
          files: validFiles.map((f) => ({
            id: f.id,
            name: f.file.name,
            size: f.file.size,
            type: f.file.type,
          })),
        });
        router.invalidate();
      } catch {
      } finally {
        toast.close(toastId);
      }
    },
  });

  return (
    <div>
      <ButtonGroup>
        <Button disabled={mutation.isPending} onClick={openFileDialog}>
          <IconCloudUpload /> Upload Files
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={mutation.isPending}
            render={
              <Button size={"icon"}>
                <IconChevronDown />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <IconFolderUp />
              Upload folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />
      </ButtonGroup>
    </div>
  );
}

function UploadProgressToast() {
  const { files } = useUploads();
  const uploading = files.filter((f) => !f.error);
  const totalBytes = uploading.reduce((sum, f) => sum + f.file.size, 0);
  const uploadedBytes = uploading.reduce(
    (sum, f) => sum + (f.file.size * (f.uploadPercent ?? 0)) / 100,
    0
  );
  const overallPercent = totalBytes
    ? Math.round((uploadedBytes / totalBytes) * 100)
    : 0;

  return (
    <Collapsible className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-heading text-base font-medium text-foreground">
            Uploading {files.length} File{files.length !== 1 && "s"}
          </h2>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-green-600">{overallPercent}%</span>
          </div>
        </div>

        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="group/upload-trigger"
              aria-label="Show uploads"
            />
          }
        >
          <IconChevronDown className="transition-transform delay-100 group-data-panel-open/upload-trigger:rotate-180" />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="-mx-4 -mb-4 pt-1 text-sm text-muted-foreground">
        <ul className="max-h-68 space-y-px overflow-auto">
          {files.map(({ id, file, error, uploadPercent }) => {
            const { type } = file;
            const { Icon, colorVar } = getFileIcon(type);

            return (
              <li
                data-error={!!error}
                key={id}
                className="group relative flex items-center gap-2 p-2 data-[error=true]:text-destructive"
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-md border border-(--icon)/20 bg-(--icon)/20 text-muted-foreground/50 group-data-[error=true]:border-destructive/30 group-data-[error=true]:bg-destructive/5 group-data-[error=true]:text-destructive/80",
                    colorVar
                  )}
                >
                  <Icon className="size-5 text-(--icon)" />
                </div>{" "}
                <div className="min-w-0">
                  <p className="truncate font-medium">{file.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{formatBytes(file.size)}</span>
                    {error && <p className="text-xs">{error}</p>}
                  </div>
                </div>
                {!error && (
                  <div
                    className="absolute inset-0 -z-10 bg-muted"
                    style={{
                      width: `${uploadPercent ?? 0}%`,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
