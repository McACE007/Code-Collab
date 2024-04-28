import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";

export default function Workspace() {
  const CodeEditor = dynamic(() => import("@/components/CodeEditor"), { ssr: false },)

  return (
    <main className="w-screen md:w-auto h-[calc(100vh-65px-50px)] md:h-[calc(100vh-65px)] flex">
      <Sidebar />
      <CodeEditor />
    </main >
  )
}

