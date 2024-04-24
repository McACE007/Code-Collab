import TabContext from "@/contexts/TabContext"
import { useContext } from "react"

function useTab() {
  return useContext(TabContext)
}

export default useTab
