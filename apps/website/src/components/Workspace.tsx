import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";
import useTab from "@/hooks/useTabs";
import { cn } from "@/lib/utils";

export default function Workspace() {
  const CodeEditor = dynamic(() => import("@/components/CodeEditor"), { ssr: false },)

  const { isSidebarOpen } = useTab();

  return (
    <main className="w-screen md:w-auto h-[calc(100vh-65px-50px)] md:h-[calc(100vh-65px)] flex">
      <Sidebar />
      <div className={cn("h-full w-full", {
        "md:w-[calc(100%-300px)]": isSidebarOpen,
        "md:w-screen": !isSidebarOpen,
      })}>
        <CodeEditor />
      </div>
    </main >
  )
}

