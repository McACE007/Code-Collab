import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react"
import FilesTab from "@/components/FileTab"
import TABS from "@/utils/tabs"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { FilesIcon, TerminalSquareIcon } from "lucide-react"
import ConsoleTab from "@/components/ConsoleTab"

type TabContextTypes = {

  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  isSidebarOpen: boolean
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  tabComponents: {
    [x: string]: JSX.Element
  };
  setTabComponents: Dispatch<SetStateAction<{
    [x: string]: JSX.Element;
  }>>;
  tabIcons: { [x: string]: JSX.Element; };
}


const TabContext = createContext<TabContextTypes>({} as TabContextTypes)

function TabContextProvider({ children }: { children: ReactNode }) {
  const { isMobile } = useWindowDimensions()
  const [activeTab, setActiveTab] = useState(TABS.FILES)
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)
  const [tabComponents, setTabComponents] = useState({
    [TABS.FILES]: <FilesTab />,
    [TABS.CONSOLE]: <ConsoleTab />
  })
  const tabIcons = {
    [TABS.FILES]: <FilesIcon size={36} className="hover:" />,
    [TABS.CONSOLE]: <TerminalSquareIcon size={36} />
  }

  return (
    <TabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        tabComponents,
        setTabComponents,
        tabIcons,
      }}
    >
      {children}
    </TabContext.Provider>
  )
}

export { TabContextProvider }
export default TabContext
