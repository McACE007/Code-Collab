import { cn } from "@/lib/utils";
import { FileTreeFileItemPropsType } from "@/types/FileTreeTypes";
import { getIcon } from "./FileTreeIcons";

export default function FileTreeFileItem({ file, icon, selectedFile, onClick }: FileTreeFileItemPropsType) {

  const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
  const depth = file.depth;

  return (
    <button onClick={onClick} className="w-full">
      <div className={cn("flex items-center hover:cursor-pointer hover:bg-primary/20 text-foreground font-medium", {
        "bg-primary/50": isSelected,
        "bg-transparent": !isSelected,
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

