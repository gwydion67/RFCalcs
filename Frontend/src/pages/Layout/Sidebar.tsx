import { IconifyIcon } from "@/components/icons";
import React from "react"
import { useNavigate } from "react-router-dom"

const Sidebar: React.FC<{ isOpen: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isOpen, setOpen }) => {

  const menu = [
    {
      title: "Dashboard",
      icon: "humbleicons:dashboard",
      path: "/"
    },
    {
      title: "Microstrip",
      icon: "mdi:microscope",
      path: "/microstrip"
    }
  ]

  const navigate = useNavigate();

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
        className={`sm:fixed w-44 fixed ${isOpen ? 'absolute translate-x-1 ' : 'fixed'} sm:translate-x-1 shadow-black  
      z-40 border-primary duration-300 ease-in-out rounded-xl transition-transform border-[1.5px]
      ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full rounded-xl px-4 p-2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className=" font-medium">
            {menu.map((item, index) => (
              <li>
                <button className=" text-lg flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => navigate(item.path)}
                >
                  <IconifyIcon icon={item.icon} />
                  <span className="ms-3">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}


export default Sidebar
