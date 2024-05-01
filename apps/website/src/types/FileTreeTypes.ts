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

export enum Type {
  FILE,
  DIRECTORY,
}

type FileTreeProps = {
  id: string;
  type: Type;
  name: string;
  path: string;
  parentId: string | undefined;
  depth: number;
}

export type File = FileTreeProps & {
  content?: string
};

export type Directory = FileTreeProps & {
  files: File[];
  dirs: Directory[];
};
