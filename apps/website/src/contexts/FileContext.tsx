import { useFile } from "@/hooks/useFile";
import { File } from "@repo/types/src";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext } from "react"

type FileContextProps = {
  loaded: boolean;
  setLoaded: Dispatch<SetStateAction<boolean>>;
  fileStructure: File[];
  selectedFile: File | undefined;
  setSelectedFile: Dispatch<SetStateAction<File | undefined>>;
  onSelect: (file: File) => void;
}

const FileContext = createContext<FileContextProps>({} as FileContextProps)

export default function FileContextProvider({ children }: { children: ReactNode }) {
  return (
    <FileContext.Provider value={useFile()}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  return useContext(FileContext);
}
