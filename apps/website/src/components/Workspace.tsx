import { useEffect, useMemo, useState } from "react";
import FileTree from "./FileTree";
import XTerm from "./XTerm";
import CodeEditor from "./CodeEditor";
import { useSocket } from "@/hooks/useSocket";
import { File } from "@repo/types/src";
import { Type } from "@repo/types/src";
import { buildFileTree } from "@/utils/fileTreeUtils";

export default function Workspace() {
  const socket = useSocket();
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState<File[]>([]);
  const rootDir = useMemo(() => {
    return buildFileTree(fileStructure);
  }, [fileStructure.length]);
  const [selectedFile, setSeletedFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (socket) {
      socket.on('loaded', ({ rootContent }: { rootContent: File[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);

  function onSelect(file: File) {
    if (file.type === Type.DIRECTORY) {
      socket?.emit("fetchDir", file.path, (data: File[]) => {
        setFileStructure((prev: File[]) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter((file, index, self) => {
            index === self.findIndex(f => f.path === file.path)
          })
        })
      })
    } else {
      socket?.emit("fetchContent", { path: file.path }, (data: string) => {
        file.content = data;
        setSeletedFile(file);
      })
    }
  }

  useEffect(() => {
    if (!selectedFile && rootDir.files.length > 0) {
      onSelect(rootDir.files[0])
    }
  }, [selectedFile, rootDir.files.length])

  if (!loaded) {
    return "Loading...";
  }

  return (
    <main className="w-screen h-[calc(100vh-65px)] overflow-hidden flex">
      < aside className="h-full w-50 bg-secondary/70" >
        <FileTree onSelect={onSelect} selectedFile={selectedFile} rootDir={rootDir} />
      </aside >
      <div className="h-full w-full">
        <CodeEditor selectedFile={selectedFile} />
      </div>
      <aside className="h-full w-[400px]">
        <XTerm />
      </aside>
    </main >
  )
}

