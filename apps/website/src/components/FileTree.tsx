import { buildFileTree, sortDir, sortFile } from "@/utils/fileTreeUtils"
import { Fragment, useEffect, useMemo } from "react";
import { SubFileTreePropsType } from "@/types/FileTreeTypes";
import FileTreeDirectoryItem from "./FileTreeDirectoryItem";
import FileTreeFileItem from "./FileTreeFileItem";
import { useFileContext } from "@/contexts/FileContext";


export default function FileTree() {
  const { fileStructure, selectedFile, onSelect } = useFileContext()
  const rootDir = useMemo(() => {
    return buildFileTree(fileStructure);
  }, [fileStructure.length]);

  useEffect(() => {
    if (!selectedFile && rootDir.files.length > 0) {
      onSelect(rootDir.files[0])
    }
  }, [rootDir])

  return <SubFileTree directory={rootDir} selectedFile={selectedFile} onSelect={onSelect} />
}

export function SubFileTree({ directory, selectedFile, onSelect }: SubFileTreePropsType) {
  return (
    <div className="w-full" style={{ marginLeft: `${directory.depth * 15}px` }}>
      {directory.dirs.sort(sortDir).map(dir => {
        return <Fragment key={dir.id}>
          <FileTreeDirectoryItem directory={dir} onSelect={onSelect} selectedFile={selectedFile} />
        </Fragment>
      })}
      {directory.files.sort(sortFile).map((file) => {
        return <Fragment key={file.id}>
          <FileTreeFileItem file={file} selectedFile={selectedFile} onClick={() => onSelect(file)} />
        </Fragment>
      })}
    </div>
  )
}



