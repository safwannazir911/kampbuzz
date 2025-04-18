import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CardsByStatus } from "./CardsByStatus";

export const ManageKlipz = () => {
  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-review">Requests</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all">
          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <CardsByStatus type="klipz" status="all" />
          </div>
        </TabsContent>
        <TabsContent value="in-review">
          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <CardsByStatus type="klipz" status="in-review" />
          </div>
        </TabsContent>
        <TabsContent value="published">
          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <CardsByStatus type="klipz" status="published" />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
