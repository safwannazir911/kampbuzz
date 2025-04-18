import React from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { BadgeEuro } from 'lucide-react';


export const RecentTransactions = () => {
    return (
        <>
            <Card className="sm:w-[40%] h-fit mt-12">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">
                                Tabeed Ahangar
                            </p>
                            <p className="text-sm text-muted-foreground">
                                tabeed@email.com
                            </p>
                        </div>
                        <div className="ml-auto font-medium">900<BadgeEuro size={20} className='mx-1' /></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">
                                Bhat Aasim
                            </p>
                            <p className="text-sm text-muted-foreground">
                                aasim@email.com
                            </p>
                        </div>
                        <div className="ml-auto font-medium">700<BadgeEuro size={20} className='mx-1' /></div>
                    </div>

                </CardContent>
            </Card></>
    )
}
