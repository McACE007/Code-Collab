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
