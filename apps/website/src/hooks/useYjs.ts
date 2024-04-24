import { EXECUTION_ENGINE_URI } from "@/config";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { SocketIOProvider } from "y-socket.io";
import { Doc } from "yjs";

export function useYjs() {
  const roomId = useParams().roomId.at(0);
  const ydoc = useRef<Doc | null>(null)
  const provider = useRef<SocketIOProvider | null>(null);

  useEffect(() => {
    ydoc.current = new Doc();
    provider.current = new SocketIOProvider(EXECUTION_ENGINE_URI, roomId!, ydoc.current, {})

    return () => {
      ydoc.current
      provider.current?.destroy()
      ydoc.current = null
      provider.current = null
    }
  }, []);

  return { ydoc: ydoc.current, provider: provider.current };
}
