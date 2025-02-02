import { Outlet } from "react-router-dom"


const Layout: React.FC = () => {
  return (
    <div className="dark:bg-white">
      Layout
      <Outlet />
    </div>
  )
}

export default Layout
