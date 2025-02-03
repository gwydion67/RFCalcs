import { IconifyIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ThemeContext, ThemeContextProps } from "@/providers/ThemeProvider";
import { MenuIcon, Moon, Sun } from "lucide-react";
import React, { useContext, useState } from "react"
import { Outlet } from "react-router-dom"

const Navbar: React.FC<{ isOpen: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isOpen, setOpen }) => {

  const { theme, toggleTheme }: ThemeContextProps = useContext(ThemeContext);
  console.log("theme ", theme)
  return (
    <nav className="mx-2 sticky px-4 top-0 z-50 border-primary border-b-[2px] rounded-b-lg mb-3 bg-amber-200/20 dark:bg-slate-900">
      <div className="flex flex-row items-center ">
        <MenuIcon className="hidden max-sm:block" onClick={() => setOpen(!isOpen)} />
        <span className="flex items-center flex-row font-semibold max-sm:mx-auto font-[Barriecito] text-3xl tracking-tight">
          <img className="w-15 h-15 mr-2" src="Logo.png" />
          RFCalcs
        </span>
        <Button variant={'ghost'} onClick={toggleTheme} className="border relative ml-auto" >
          {theme == 'dark' ?
            <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Theme
        </Button>
      </div>
    </nav>
  )
}

const Sidebar: React.FC<{ isOpen: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isOpen, setOpen }) => {
  return (
    <>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside id="sidebar-multi-level-sidebar"
        style={{ height: "calc(100vh - 80px)" }}
        className={`sm:static ${isOpen ? 'absolute translate-x-1 ' : 'fixed'} sm:translate-x-1 shadow-black  
      z-40 border-primary duration-300 ease-in-out rounded-xl transition-transform border-[1.5px]
      ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full rounded-xl px-4 p-2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <span className="content-center justify-center text-lg flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <IconifyIcon icon={"humbleicons:dashboard"}/>
                <span className="ms-3">Dashboard</span>
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}

const Layout: React.FC = () => {

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-dvh dark:text-primary bg-lime-50 dark:bg-slate-800 text-black ">
      <Navbar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
      />
      <main className="flex-1 flex flex-row overflow-auto ">
        <Sidebar
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
        />
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
