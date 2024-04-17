"use client"
import { File } from "@repo/types/src";
import themeMapper from "@/utils/themeMapper";
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"

export default function CodeEditor({ selectedFile }: { selectedFile: File | undefined }) {

  const { theme, resolvedTheme } = useTheme();
  const codeEditorTheme = themeMapper(theme, resolvedTheme);

  if (!selectedFile) return null;

  const content = selectedFile.content
  let language = selectedFile.name.split('.').pop()
  switch (language) {
    case "js":
      language = "javascript"
      break;
    case "ts":
      language = "typescript"
      break;
    case "py":
      language = "python"
      break;
    default:
      break;
  }


  return (

    <Editor
      height="100%"
      theme={codeEditorTheme}
      language={language}
      value={selectedFile.content}
    // onChange={debounce(() => {
    //   socket.emit("updateContent", { path: selectedFile.path, content: value });
    // }, 500)}
    />
  )
}

