import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  LineChart,
  Package2,
  PanelLeft,
  Settings,
  Coins,
  BadgePlus,
  ArrowRightLeft,
  BadgeEuro,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { CrudServices } from "../../../Api/CrudServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState();
  const [loading, setLoading] = useState(false);

  const crudServices = new CrudServices();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await crudServices.getInstitutionDetails();
      // console.log("Dashboard Res", response.data.institution);
      if (response.data) {
        setInstitution(response?.data?.institution);
      } else {
        toast.error("Failed to fetch user profile. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoute = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    signOut();
    navigate("/");
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            to="/home"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Kamp Buzz</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/home"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/create"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <BadgePlus className="h-5 w-5" />
                <span className="sr-only">Create</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Create</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/add-coins"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Coins className="h-5 w-5" />
                <span className="sr-only">Add K-Coins</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Add K-Coins</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/trasfer-coins"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <ArrowRightLeft className="h-5 w-5" />
                <span className="sr-only">Transfer K-Coins</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Transfer K-Coins</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/analitics"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/home"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Kamp Buzz</span>
                </Link>
                <Link
                  to="/home"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  to="/create"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <BadgePlus className="h-5 w-5" />
                  Create
                </Link>

                <Link
                  to="/add-coins"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Coins className="h-5 w-5" />
                  Add K-Coins
                </Link>

                <Link
                  to="/trasfer-coins"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  Transfer K-Coins
                </Link>

                <Link
                  to="/analitics"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analitics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl lg:text-2xl font-semibold">Dashboard</h1>

          <DropdownMenu>
            <div className="flex items-center justify-between ">
              <small className="text-sm font-medium leading-none mr-1">
                {institution?.kcoins}
              </small>
              <BadgeEuro size={25} color="#9333ea" className="mr-3" />

              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <Skeleton className="h-8 w-8 rounded-full bg-slate-400" />
                    </div>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={institution?.avatar}
                        alt={institution?.name}
                      />
                      <AvatarFallback>
                        {institution?.name.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{institution?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoute("/profile/update")}
                >
                  Update Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        </header>

        <main className="grid flex-1 justify-center items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
