import { Directory, File } from "@repo/types/src"

export type RootFileTreePropsType = {
  rootDir: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
}

export type SubFileTreePropsType = {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
}

export type FileTreeFileItemPropsType = {
  file: File | Directory;
  icon?: string;
  selectedFile: File | undefined;
  onClick: () => void;
}

