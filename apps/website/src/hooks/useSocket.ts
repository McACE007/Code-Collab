import { EXECUTION_ENGINE_URI } from "@/config";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export function useSocket(roomId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(`${EXECUTION_ENGINE_URI}?roomId=${roomId}`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, [roomId]);
  return socket;
}
