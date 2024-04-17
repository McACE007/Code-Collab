"use client"
import { File } from "@repo/types/src";
import CodeEditor from "./CodeEditor";
import FileTree from "./FileTree";
import LeftSideBar from "./LeftSideBar";
import { buildFileTree } from "@/utils/fileTreeUtils";
import { useEffect, useMemo } from "react";
import { TerminalComponent } from "./Terminal";
import { Socket } from "socket.io-client";

type PropsType = {
  files: File[];
  onSelect: (file: File) => void;
  selectedFile: File | undefined;
  socket: Socket;
}

export default function CodeEditorWithFileTree({ files, onSelect, selectedFile, socket }: PropsType) {
  const rootDir = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  useEffect(() => {
    if (!selectedFile) {
      onSelect(rootDir.files[0])
    }
  }, [selectedFile])

  return (
    <div className="h-full w-full grid grid-cols-3">
      <LeftSideBar>
        <FileTree rootDir={rootDir} selectedFile={selectedFile} onSelect={onSelect} />
      </LeftSideBar>
      <CodeEditor selectedFile={selectedFile} />
      <TerminalComponent socket={socket} />
    </div>
  )
}

