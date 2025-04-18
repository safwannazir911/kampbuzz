import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CardsByStatus } from "./CardsByStatus";
import { manageStatus } from "./constants/constants";

export const ManageKlipz = () => {
  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-review">In-Review</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </div>
        {manageStatus.map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
              <CardsByStatus type="klipz" status={status} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};
