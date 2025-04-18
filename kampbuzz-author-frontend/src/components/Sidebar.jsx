import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import google from "@/assets/google.png";
import app from "@/assets/app.png";
import { LucideMenu, Monitor, TabletSmartphone } from "lucide-react"; // Import the icons you need
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <Sheet open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <SheetTrigger asChild>
          <Button size={"icon"} variant="outline">
            <LucideMenu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="grid gap-4 py-10">
            <Link
              to="/some-link"
              className="block py-2 px-4 text-gray-900 hover:bg-gray-100"
            >
              Some Links
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
  );
};
