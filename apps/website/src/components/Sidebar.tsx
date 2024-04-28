import useResponsive from "@/hooks/useResponsive"
import useTab from "@/hooks/useTabs"
import TABS from "@/utils/tabs"

function TabButton({ tabName, icon }: { tabName: string, icon: JSX.Element }) {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = useTab()

  const handleTabClick = (tabName: string) => {
    if (tabName === activeTab) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setIsSidebarOpen(true)
      setActiveTab(tabName)
    }
  }

  return (
    <button
      onClick={() => handleTabClick(tabName)}
      className="relative flex items-center justify-center"
    >
      {icon}
    </button>
  )
}

function Sidebar() {
  const { activeTab, isSidebarOpen, tabComponents, tabIcons } = useTab()
  const { showSidebar } = useResponsive()

  return (
    <aside className="flex w-auto md:h-full md:max-h-full md:min-h-full md:w-auto">
      <div
        className="fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-6 self-end overflow-auto border-t bg-secondary border-border dark:border-darkHover dark:bg-dark px-3 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-0 md:pt-4"
        style={showSidebar ? {} : { display: "none" }}
      >
        <TabButton tabName={TABS.FILES} icon={tabIcons[TABS.FILES]} />
        <TabButton tabName={TABS.CONSOLE} icon={tabIcons[TABS.CONSOLE]} />
      </div>
      <div
        className="absolute p-1 left-0 z-20 h-[calc(100%-60px-65px)] md:h-full w-screen flex-grow flex-col bg-secondary dark:bg-dark md:static md:w-[300px] overflow-y-auto"
        style={isSidebarOpen ? {} : { display: "none" }}
      >
        <div className="h-full w-full flex flex-col justify-start items-center">
          {tabComponents[activeTab]}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
