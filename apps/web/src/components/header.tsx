import { UploadFilesButton } from "./upload-files-button";

export function Header() {
  return (
    <header className="flex h-(--header-height) items-center justify-between border-b border-border/70 px-5">
      <h1 className="font-heading text-lg font-medium">Welcome to Drive</h1>
      <div>
        <UploadFilesButton />
      </div>
    </header>
  );
}
