import ThemeProvider from "@/providers/ThemeProvider"
import React from "react"
import { Outlet } from "react-router-dom"


const Providers= () => {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}
export default Providers
