import { sortDir, sortFile } from "@/utils/fileTreeUtils"
import { Fragment } from "react";
import { RootFileTreePropsType, SubFileTreePropsType } from "@/types/FileTreeTypes";
import FileTreeDirectoryItem from "./FileTreeDirectoryItem";
import FileTreeFileItem from "./FileTreeFileItem";

export default function FileTree(props: RootFileTreePropsType) {
  return <SubFileTree directory={props.rootDir} {...props} />
}

export function SubFileTree({ directory, selectedFile, onSelect }: SubFileTreePropsType) {
  return (
    <div>
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



