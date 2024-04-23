import { SubFileTreePropsType } from "@/types/FileTreeTypes";
import { useState } from "react";
import FileTreeFileItem from "./FileTreeFileItem";
import { isChildSelected } from "@/utils/fileTreeUtils";
import { SubFileTree } from "./FileTree";

export default function FileTreeDirectoryItem({ directory, selectedFile, onSelect }: SubFileTreePropsType) {
  let defaultOpen = false;
  if (selectedFile)
    defaultOpen = isChildSelected(directory, selectedFile)
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <FileTreeFileItem
        file={directory}
        icon={open ? "openDirectory" : "closedDirectory"}
        selectedFile={selectedFile}
        onClick={() => {
          if (!open) onSelect(directory)
          setOpen(!open)
        }} />
      {open ? (<SubFileTree directory={directory} selectedFile={selectedFile} onSelect={onSelect} />) : null}
    </>
  )
}

