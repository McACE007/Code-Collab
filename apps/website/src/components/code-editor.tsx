"use client"
import themeMapper from "@/utils/themeMapper";
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"

export default function CodeEditor() {
  const { theme, resolvedTheme } = useTheme();
  const codeEditorTheme = themeMapper(theme, resolvedTheme);

  return (
    <Editor
      theme={codeEditorTheme}
    />
  )
}

