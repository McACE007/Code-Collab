"use client"
import Workspace from "@/components/Workspace";
import FileContextProvider from "@/contexts/FileContext";
import { TabContextProvider } from "@/contexts/TabContext";
import SocketProvider from "@/providers/SocketProvider";
//@ts-ignore
import NoSSR from "next-no-ssr";

export default function Page() {
  return (
    <NoSSR>
      <SocketProvider>
        <TabContextProvider>
          <FileContextProvider>
            <Workspace />
          </FileContextProvider>
        </TabContextProvider>
      </SocketProvider>
    </NoSSR>
  )
}

