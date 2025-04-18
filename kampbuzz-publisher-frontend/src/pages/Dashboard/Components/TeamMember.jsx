import React, { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react"; // Import necessary icons from lucide-react
import { toast } from "sonner"; // Import toast from sonner
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Component copied from @safwannazir911
 * From Institution
 * @param {*} param0
 * @returns
 */

const TeamMember = ({ id, name, email, onViewProfile, onDelete }) => {
  const copyToClipboard = (data) => {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        toast.success("Copied to clipboard.");
      })
      .catch(() => {
        toast.error("Failed to copy.");
      });
  };

  const handleViewProfile = () => {
    onViewProfile(id);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <Card className="border rounded p-4 shadow-sm flex justify-between md:w-[40%] w-full m-3">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <p className="mr-2">{email}</p>
            <Copy
              strokeWidth={2}
              size={"15px"}
              className="cursor-pointer"
              onClick={() => copyToClipboard(email)}
            />
          </div>
        </CardDescription>
      </CardHeader>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Manage</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleViewProfile}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default TeamMember;
