import { Button } from "@/components/ui/button"
import logo from "../asset/logo.png"
import { SideBar } from "./Sidebar"
import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <div className="flex items-center justify-between h-16 p-4">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-[3rem] md:h-[3.5rem]" />
        </Link>
      </div>

      <div className="flex items-center">
        <SideBar />
      </div>
    </div>
  )
}
