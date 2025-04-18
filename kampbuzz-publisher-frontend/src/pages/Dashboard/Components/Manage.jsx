import React from "react";
import { Stats } from "./Stats";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ManageKlipz } from "./ManageKlipz";
import { ManageFramez } from "./ManageFramez";
import { ManagePosts } from "./ManagePosts";

export default function Manage() {
  return (
    <>
      <Stats />
      <div className="text-3xl font-bold">Manage everything at one place</div>
      <Tabs defaultValue="posts">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="klipz">Klipz</TabsTrigger>
            <TabsTrigger value="framez">Framez</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts">
          <div>
            <ManagePosts />
          </div>
        </TabsContent>
        <TabsContent value="klipz">
          <div>
            <ManageKlipz />
          </div>
        </TabsContent>
        <TabsContent value="framez">
          <div>
            <ManageFramez />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
