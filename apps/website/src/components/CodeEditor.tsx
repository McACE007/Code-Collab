import themeMapper from "@/utils/themeMapper";
import Editor, { OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react";
import { MonacoBinding } from 'y-monaco'
import * as Y from 'yjs';
import "./CodeEditor.css"
import { useSocket } from "@/hooks/useSocket";
import { debounce } from "@/utils/debounce"
import { useFileContext } from "@/contexts/FileContext";
import { useYjs } from "@/hooks/useYjs";

export default function CodeEditor() {
  const { theme, resolvedTheme } = useTheme();
  const codeEditorTheme = themeMapper(theme, resolvedTheme);
  const editorRef = useRef<any>(null)
  const ytext = useRef<Y.Text | null>(null);
  const binding = useRef<MonacoBinding | null>(null);
  const [t, setT] = useState<null | undefined>(null);
  const socket = useSocket();
  const { ydoc, provider } = useYjs();
  const { selectedFile } = useFileContext();


  const handleOnDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    setT(undefined);
  }

  useEffect(() => {
    if (ydoc && editorRef.current && selectedFile) {
      ytext.current = ydoc.getText(selectedFile?.name || "code");
      binding.current = new MonacoBinding(ytext.current, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness)
    }
    return () => {
      ytext.current = null
      binding.current?.destroy()
      setT(null)
    }
  }, [selectedFile, editorRef.current])

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
      width="100%"
      theme={codeEditorTheme}
      language={language}
      onChange={debounce((value) => {
        socket?.emit("updateContent", { path: selectedFile.path, content: value });
      }, 1500)}
      onMount={handleOnDidMount} />
  )
}

