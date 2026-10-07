import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { FileWithPreview } from "@/hooks/use-file-upload";

interface UploadsContextValue {
  files: FileWithPreview[];
  setFiles: Dispatch<SetStateAction<FileWithPreview[]>>;
  /** Merge changes into one file, keeping list order. */
  patchFile: (id: string, changes: Partial<FileWithPreview>) => void;
}

const UploadsContext = createContext<UploadsContextValue | null>(null);

export function UploadsProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const patchFile = useCallback(
    (id: string, changes: Partial<FileWithPreview>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...changes } : f))
      );
    },
    []
  );

  const value = useMemo(
    () => ({ files, setFiles, patchFile }),
    [files, patchFile]
  );

  return (
    <UploadsContext.Provider value={value}>{children}</UploadsContext.Provider>
  );
}

export function useUploads() {
  const context = useContext(UploadsContext);
  if (!context) {
    throw new Error("useUploads must be used within an UploadsProvider");
  }
  return context;
}
