import { Button } from "@/components/ui/button";
import { ThemeContext, ThemeContextProps } from "@/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useContext } from "react"
import { Outlet } from "react-router-dom"

const Navbar = () => {

  const { theme, toggleTheme }: ThemeContextProps = useContext(ThemeContext);
  console.log("theme ", theme)
  return (
    <nav className="sticky px-4 top-0 z-50 w-full border-b bg-background">
      <div className="flex flex-row items-center justify-between">
        <img className="w-15 h-15" src="../../../public/Logo.png" />
        <span className="font-semibold font-[Barriecito] text-4xl sm:text-lg md:text-3xl tracking-tight">
          RFCalcs
        </span>
        <Button variant={'ghost'} onClick={toggleTheme} className="border" >
          {theme == 'dark' ?
            <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Theme
        </Button>
      </div>

    </nav>
  )
}

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 dark:text-primary bg-background dark:bg-[#24283C] text-black ">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout
