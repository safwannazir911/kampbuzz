import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CardAcceptDialog({ data, onUpdateStatus }) {
  /**
   * -H
   * @name handleStatusChange
   * This function sets the new status of the post
   * The new status is fed to this function by an arrow function in the corresponding button
   * reject button feeds status 'rejected' to this funtion
   * publish button feeds status 'published' to this function
   *
   * This function then combines the new status and id of the current post and calls the prop function
   * @param {*} status
   */
  const handleStatusChange = (status) => {
    onUpdateStatus(data._id, status);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          role="menuitem"
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-black-500"
          tabIndex="-1"
          data-orientation="vertical"
          data-radix-collection-item=""
        >
          Change Status
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Post Status</DialogTitle>
          <p className="text-sm text-gray-500">
            Current status: <strong>{data.status}</strong>
          </p>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => handleStatusChange("rejected")}
          >
            Reject
          </Button>
          <Button
            variant="outline"
            // onClick={() => handleStatusChange("Request Changes")}
          >
            Request Changes
          </Button>
          <Button
            variant="primary"
            onClick={() => handleStatusChange("published")}
            className="bg-green-200"
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
