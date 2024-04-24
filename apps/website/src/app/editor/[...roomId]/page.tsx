"use client"
import Workspace from "@/components/Workspace";
import FileContextProvider from "@/contexts/FileContext";
import { TabContextProvider } from "@/contexts/TabContext";
import SocketProvider from "@/providers/SocketProvider";

export default function Page() {
  return (
    <SocketProvider>
      <TabContextProvider>
        <FileContextProvider>
          <Workspace />
        </FileContextProvider>
      </TabContextProvider>
    </SocketProvider>
  )
}

