import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/code-editor";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="w-screen h-[calc(100vh-40px)]">
        <CodeEditor />
      </main>
    </>
  )
}

