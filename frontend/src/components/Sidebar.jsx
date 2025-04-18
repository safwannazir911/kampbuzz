import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import google from "../asset/google.png"
import app from "../asset/app.png"
import { Monitor, TabletSmartphone } from "lucide-react" // Import the icons you need
import logo from "../asset/logo.png"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"

export const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <Sheet open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <SheetTrigger asChild>
          <Button variant="outline" size={'icon'}>
            <HamburgerMenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="grid gap-4 py-10">
            {location.pathname === "/signup" ? (
              <Link
                to="/login"
                className="block py-2 px-4 text-gray-900 hover:bg-gray-100"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/signup"
                className="block py-2 px-4 text-gray-900 hover:bg-gray-100"
              >
                Signup
              </Link>
            )}
            <Link
              to="/feed"
              className="block py-2 px-4 text-gray-900 hover:bg-gray-100"
            >
              Feed
            </Link>
            <Link
              to="/report"
              className="block py-2 px-4 text-gray-900 hover:bg-gray-100"
            >
              Report an Issue
            </Link>
          </div>

          <SheetFooter>
            <div className="flex justify-center items-center flex-col m-5 absolute bottom-10 left-0 w-full">
              <img src={logo} alt="" />

              <div className="flex flex-row gap-x-0.5">
                <Monitor />
                <TabletSmartphone />
              </div>

              <p className="text-xl text-muted-foreground mb-2">
                Buzz on any screen
              </p>

              <div className="flex flex-row gap-x-0.5">
                <img src={google} alt="" className="w-20" />
                <img src={app} alt="" className="w-20" />
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
