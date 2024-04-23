import { File, Type } from "@repo/types/src";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

export function useFile() {
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const socket = useSocket();

  function onSelect(file: File) {
    if (file.type === Type.DIRECTORY) {
      socket?.emit("fetchDir", file.path, (data: File[]) => {
        setFileStructure((prev: File[]) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter((file, index, self) => {
            return self.findIndex(f => f.path === file.path) === index;
          })
        })
      })
    } else {
      socket?.emit("fetchContent", { path: file.path }, (data: string) => {
        file.content = data;
        setSelectedFile(file);
      })
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('loaded', ({ rootContent }: { rootContent: File[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);

  return {
    loaded, setLoaded, fileStructure, setFileStructure, selectedFile, setSelectedFile, onSelect
  };
}
