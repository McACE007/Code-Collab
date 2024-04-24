import { useEffect, useState } from "react"
import useWindowDimensions from "./useWindowDimensions"

function useResponsive() {
  const [showSidebar, setShowSidebar] = useState(false)
  const { height } = useWindowDimensions()

  useEffect(() => {
    if (height < 500) {
      setShowSidebar(false)
    } else {
      setShowSidebar(true)
    }
  }, [height])

  return { showSidebar }
}

export default useResponsive
