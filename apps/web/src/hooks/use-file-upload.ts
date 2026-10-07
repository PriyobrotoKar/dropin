import { MAX_FILE_SIZE } from "@dropin/contracts/entities/file";
import type { UploadFilesResponse } from "@dropin/contracts/storage";
import { useUploads } from "@/features/upload/uploads-context";
import {
  useRef,
  type ComponentPropsWithRef,
  type InputHTMLAttributes,
} from "react";

interface FileMetadata {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface FileWithPreview {
  file: File | FileMetadata;
  id: string;
  preview: string;
  uploadPercent?: number;
  error?: string;
}

interface UseFileUploadProps {
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: FileWithPreview[]) => void;
}

export function useFileUpload({
  maxSize = MAX_FILE_SIZE,
  accept,
  multiple = true,
  onFilesChange,
}: UseFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { files: state, setFiles: setState, patchFile } = useUploads();

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const createFilePreview = (file: File | FileMetadata): string => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file.url;
  };

  const generateFileId = (file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${crypto.randomUUID()}`;
    }
    return file.id;
  };

  const validateFile = (file: File | FileMetadata): boolean => {
    if (file instanceof File) {
      if (file.size > maxSize) return false;
    } else if (file.size > maxSize) return false;

    return true;
  };

  const uploadToCloud = async (
    uploadUrls: UploadFilesResponse["uploadUrls"],
    files: FileWithPreview[]
  ) => {
    const promises = [];

    for (const { id, url } of uploadUrls) {
      const file = files.find((f) => f.id === id);

      if (!file || !(file.file instanceof File)) continue;

      const request = XMLUpload(
        file.file,
        url,
        (percent) => patchFile(id, { uploadPercent: percent }),
        () => patchFile(id, { error: "Upload failed" }),
        () => patchFile(id, { error: "Upload aborted" })
      );

      promises.push(request);
    }

    await Promise.all(promises);
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const newFiles: FileWithPreview[] = [];

    for (const file of filesArray) {
      // check for duplicates if multiple files are selected
      if (multiple) {
        const isDuplicate = state.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        );

        if (isDuplicate) continue; // skip duplicates
      }

      const isValid = validateFile(file);

      newFiles.push({
        file,
        id: generateFileId(file),
        preview: createFilePreview(file),
        error: isValid ? undefined : "File is too large.",
      });
    }

    onFilesChange?.(newFiles);
    setState(newFiles);
  };

  const getInputProps = (
    props: InputHTMLAttributes<HTMLInputElement> = {}
  ): ComponentPropsWithRef<"input"> => ({
    ...props,
    type: "file",
    accept,
    multiple,
    onChange: handleFilesChange,
    ref: inputRef,
  });

  return {
    state,
    getInputProps,
    openFileDialog,
    uploadToCloud,
  };
}

const UNITS = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;

const formatters = UNITS.map(
  (unit, i) =>
    new Intl.NumberFormat("en", {
      style: "unit",
      unit,
      unitDisplay: "short",
      maximumFractionDigits: i === 0 ? 0 : 1,
    })
);

export const formatBytes = (bytes: number) => {
  const i = Math.min(
    Math.floor(Math.log(bytes || 1) / Math.log(1024)),
    UNITS.length - 1
  );
  return formatters[i].format(bytes / 1024 ** i).replace("kB", "KB");
};

const XMLUpload = (
  file: File,
  url: string,
  onProgress: (percent: number) => void,
  onError: () => void,
  onAbort: () => void
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url, true);

    xhr.setRequestHeader("Content-Type", file.type);

    // upload progress, not download progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    // 4. Handle successful or failed completions
    xhr.onload = () => {
      // S3 returns a 200 OK status code upon successful PUT upload
      if (xhr.status === 200) {
        resolve("Upload successful");
      } else {
        reject(
          new Error(
            `Upload failed with status: ${xhr.status} ${xhr.statusText}`
          )
        );
      }
    };

    // 5. Handle network-level errors
    xhr.onerror = onError;
    xhr.onabort = onAbort;

    // 6. Send the raw binary file payload
    xhr.send(file);
  });
};
