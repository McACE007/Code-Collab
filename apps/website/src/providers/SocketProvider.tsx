import { EXECUTION_ENGINE_URI } from "@/config";
import { SocketContext } from "@/contexts/SocketContext";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export default function SocketProvider({ children }: { children?: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const roomId = useParams().roomId.at(0);

  useEffect(() => {
    const _socket = io(`${EXECUTION_ENGINE_URI}?roomId=${roomId}`);
    setSocket(_socket);

    return () => {
      _socket.disconnect();
      setSocket(null);
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
