import React, { useState } from 'react';
import { Copy, Eye, EyeOff } from 'lucide-react'; // Import necessary icons from lucide-react
import { toast } from 'sonner'; // Import toast from sonner
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dropdown-menu"
import {
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const EntityCard = ({ name, email }) => {

    const copyToClipboard = (data) => {
        navigator.clipboard.writeText(data)
            .then(() => {
                toast.success("Copied to clipboard.");
            })
            .catch(() => {
                toast.error("Failed to copy.");
            });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <Card className="border rounded p-4 shadow-sm flex justify-between w-[90%] m-auto mb-2">
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
                        <DropdownMenuItem>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>


        </Card>
    );
};

export default EntityCard;
