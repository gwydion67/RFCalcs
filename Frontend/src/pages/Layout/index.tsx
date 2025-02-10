import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


const Layout: React.FC = () => {

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-dvh dark:text-primary bg-lime-50 dark:bg-slate-800 text-black ">
      <Navbar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
      />
      <main className="flex-1 gap-1 flex flex-row overflow-auto ">
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
