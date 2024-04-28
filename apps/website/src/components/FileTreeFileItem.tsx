import { cn } from "@/lib/utils";
import { FileTreeFileItemPropsType } from "@/types/FileTreeTypes";
import { getIcon } from "./FileTreeIcons";

export default function FileTreeFileItem({ file, icon, selectedFile, onClick }: FileTreeFileItemPropsType) {

  const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
  const depth = file.depth;

  return (
    <button onClick={onClick} className="w-full">
      <div className={cn("flex items-center hover:cursor-pointer hover:bg-darkHover/30  dark:hover:bg-darkHover/90 font-medium hover:text-foreground", {
        "bg-darkHover/20 dark:bg-darkHover/70 text-foreground": isSelected,
        "bg-transparent text-muted-foreground": !isSelected,
      }, `pl-[${depth * 16}px]`)}>
        <div className="flex w-8 h-8 justify-center items-center">
          {getIcon(icon, file.name.split('.').pop() || "")}
        </div>
        <div className="ml-1">
          {file.name}
        </div>
      </div>
    </button>
  )
}

