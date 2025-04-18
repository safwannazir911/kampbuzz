import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AuthorCards } from './AuthorCards'
import { PublisherCards } from './PublisherCards'


export const EntityTabs = () => {
    return (
        <>
            <Tabs defaultValue="author" className="sm:w-[60%]">
                <TabsList className="grid sm:w-[60%] grid-cols-2 m-auto">
                    <TabsTrigger value="author">Authors</TabsTrigger>
                    <TabsTrigger value="publisher">Publishers</TabsTrigger>
                </TabsList>
                <TabsContent value="author">
                    <AuthorCards />
                </TabsContent>
                <TabsContent value="publisher">
                    <PublisherCards/>
                </TabsContent>
            </Tabs></>
    )
}
