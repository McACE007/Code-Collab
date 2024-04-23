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
import { Output } from "./Output";
import FileContextProvider from "@/contexts/FileContext";

export default function Workspace() {
  const roomId = useParams().roomId.at(0);
  const socket = useSocket();
  const ydoc = useRef<Y.Doc | null>(null)
  const provider = useRef<SocketIOProvider | null>(null);

  const Term = dynamic(() => import("@/components/XTerm"), { ssr: false },)

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

  return (
    <main className="w-screen h-[calc(100vh-65px)] overflow-hidden flex">
      <FileContextProvider>
        < aside className="h-full w-56 bg-secondary/70" >
          <FileTree />
        </aside >
        <div className="h-full w-[calc(100vw-224px-330px)]">
          <CodeEditor ydoc={ydoc.current!} provider={provider.current!} />
        </div>
      </FileContextProvider>
      <aside className="h-full w-[330px] bg-secondary flex flex-col items-center justify-center">
        <Output />
        <Term />
      </aside>
    </main >
  )
}

