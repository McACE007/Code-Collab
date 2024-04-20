"use client"
import Workspace from "@/components/Workspace";
import SocketProvider from "@/providers/SocketProvider";

export default function Page() {
  return (
    <SocketProvider>
      <Workspace />
    </SocketProvider>
  )
}

