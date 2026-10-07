import type { GetFilesResponse } from "@dropin/contracts/file";
import { createContext, useContext, useState } from "react";

interface FileSelectorContextProps {
  selectedFiles: GetFilesResponse;
  setSelectedFiles: React.Dispatch<React.SetStateAction<GetFilesResponse>>;
}

const fileSelectorContext = createContext<FileSelectorContextProps | null>(
  null
);

export function FileSelectorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedFiles, setSelectedFiles] = useState<GetFilesResponse>([]);

  return (
    <fileSelectorContext.Provider value={{ selectedFiles, setSelectedFiles }}>
      {children}
    </fileSelectorContext.Provider>
  );
}

export function useFileSelector() {
  const context = useContext(fileSelectorContext);

  if (!context) {
    throw new Error(
      "useFileSelector must be used within a FileSelectorProvider"
    );
  }
  return context;
}
