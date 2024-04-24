import { FilePlus, FolderPlus } from "lucide-react";
import FileTree from "./FileTree";

export default function FileTab() {
  return (
    <>
      {/* <div className="container border-b border-border dark:border-darkHover w-full mb-2 mt-4 pb-2 flex items-center justify-evenly"> */}
      {/*   <FilePlus size={20} /> */}
      {/*   <FolderPlus size={20} /> */}
      {/* </div> */}
      <FileTree />
    </>
  )
}

