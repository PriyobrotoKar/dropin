import {
  IconFileFilled,
  IconFileSpreadsheet,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeTxt,
  IconFileWord,
  IconFileZip,
  IconHeadphones,
  IconMovie,
  IconPhotoFilled,
  type IconProps,
} from "@tabler/icons-react";

const fileIconMap: Record<
  string,
  {
    Icon: React.FC<IconProps>;
    colorVar: string;
    type: string;
  }
> = {
  "image/": {
    Icon: IconPhotoFilled,
    colorVar: "[--icon:var(--color-red-500)]",
    type: "Image",
  },
  "video/": {
    Icon: IconMovie,
    colorVar: "[--icon:var(--color-red-500)]",
    type: "Video",
  },
  "application/zip,application/x-zip": {
    Icon: IconFileZip,
    colorVar: "[--icon:var(--color-blue-500)]",
    type: "Compressed archive",
  },
  "application/pdf": {
    Icon: IconFileTypePdf,
    colorVar: "[--icon:var(--color-red-500)]",
    type: "PDF",
  },
  "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf":
    {
      Icon: IconFileWord,
      colorVar: "[--icon:var(--color-green-500)]",
      type: "Word document",
    },
  "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.oasis.opendocument.spreadsheet":
    {
      Icon: IconFileSpreadsheet,
      colorVar: "[--icon:var(--color-green-500)]",
      type: "Spreadsheet",
    },
  "text/plain,text/markdown": {
    Icon: IconFileTypeTxt,
    colorVar: "[--icon:var(--color-yellow-500)]",
    type: "Text Document",
  },
  "audio/": {
    Icon: IconHeadphones,
    colorVar: "[--icon:var(--color-red-500)]",
    type: "Audio",
  },
};

export function getFileIcon(fileType: string) {
  const fileIcon = Object.entries(fileIconMap).find(([key]) =>
    key.includes(",")
      ? key.split(",").some((k) => fileType.startsWith(k))
      : fileType.startsWith(key)
  )?.[1];

  if (!fileIcon)
    return {
      Icon: IconFileFilled,
      colorVar: "[--icon:var(--color-muted-foreground)]",
      type: "Binary",
    };

  return fileIcon;
}
