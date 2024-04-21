import { useEffect, useMemo, useRef, useState } from "react";
import FileTree from "./FileTree";
import CodeEditor from "./CodeEditor";
import { useSocket } from "@/hooks/useSocket";
import { File } from "@repo/types/src";
import { Type } from "@repo/types/src";
import { buildFileTree } from "@/utils/fileTreeUtils";
import { EXECUTION_ENGINE_URI } from "@/config";
import { SocketIOProvider } from 'y-socket.io'
import * as Y from 'yjs';
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

export default function Workspace() {
  const roomId = useParams().roomId.at(0);
  const socket = useSocket();
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState<File[]>([]);
  const ydoc = useRef<Y.Doc | null>(null)
  const provider = useRef<SocketIOProvider | null>(null);
  const rootDir = useMemo(() => {
    return buildFileTree(fileStructure);
  }, [fileStructure.length]);
  const [selectedFile, setSeletedFile] = useState<File | undefined>(undefined);

  const Term = dynamic(() => import("@/components/XTerm"), { ssr: false })

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
    ydoc.current = new Y.Doc();
    provider.current = new SocketIOProvider(EXECUTION_ENGINE_URI, roomId!, ydoc.current, {})

    return () => {
      ydoc.current
      provider.current?.destroy()
      ydoc.current = null
      provider.current = null
    }
  }, []);

  useEffect(() => {
    if (!selectedFile && rootDir.files.length > 0) {
      onSelect(rootDir.files[0])
    }
  }, [rootDir.files])

  if (!loaded) {
    return "Loading...";
  }

  return (
    <main className="w-screen h-[calc(100vh-65px)] overflow-hidden flex">
      < aside className="h-full w-50 bg-secondary/70" >
        <FileTree onSelect={onSelect} selectedFile={selectedFile} rootDir={rootDir} />
      </aside >
      <div className="h-full w-full">
        <CodeEditor selectedFile={selectedFile} ydoc={ydoc.current!} provider={provider.current!} />
      </div>
      <aside className="h-full w-[400px]">
        <Term />
      </aside>
    </main >
  )
}

