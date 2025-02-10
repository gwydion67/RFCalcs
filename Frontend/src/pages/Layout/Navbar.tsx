import { Button } from "@/components/ui/button";
import { ThemeContext, ThemeContextProps } from "@/providers/ThemeProvider";
import { MenuIcon, Moon, Sun } from "lucide-react";
import React, { useContext, useState } from "react"

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

export default Navbar;
