import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  STUDENT_DASHBOARD,
  RESET_PASSWORD,
  PROFILE_UPDATE,
  REGISTER_AS_AUTHOR,
} from "@/constants/endpoints";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { imageUrl } from "@/constants/imageUrls";

export function UserNav({ data }) {
  // console.log("User nav", data)
  const navigate = useNavigate();
  const signOut = useSignOut();

  const handleRoute = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={data.avatar || imageUrl} alt={"kampbuzz User"} />
            <AvatarFallback>{data.name.charAt(0) || "K"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {data.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.email || "user@kampbuzz.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleRoute(STUDENT_DASHBOARD)}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoute(REGISTER_AS_AUTHOR)}>
            Register as an Author
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoute(RESET_PASSWORD)}>
            Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoute(PROFILE_UPDATE)}>
            Update Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
