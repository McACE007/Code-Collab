"use client"
import { useEffect, useState } from "react";
import { useParams, } from "next/navigation";
import { File, Type } from "@repo/types/src";
import CodeEditorWithFileTree from "@/components/CodeEditorWithFileTree";
import { useSocket } from "@/hooks/useSocket";
import { TerminalComponent } from "@/components/Terminal";

export default function Page() {
  const roomId = useParams().roomId[0];
  const [loaded, setLoaded] = useState(false);
  const socket = useSocket(roomId);
  const [fileStructure, setFileStructure] = useState<File[]>([]);
  const [selectedFile, setSeletedFile] = useState<File | undefined>(undefined)
  const [showOutput, setShowOutput] = useState(false);


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
        setFileStructure(prev => {
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

  if (!loaded) {
    return "Loading...";
  }

  return (
    <main className="w-screen h-[calc(100vh-65px)] overflow-hidden">
      <CodeEditorWithFileTree socket={socket!} files={fileStructure} onSelect={onSelect} selectedFile={selectedFile} />
      <TerminalComponent socket={socket!} />
    </main>
  )
}

