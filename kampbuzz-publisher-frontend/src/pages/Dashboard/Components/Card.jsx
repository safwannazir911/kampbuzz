import React from "react";
import { EllipsisVertical } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { toast } from "sonner";
import { CardEditDialog } from "./CardEditDialog";
import CardDeleteDialog from "./CardDeleteDialog";
import CardViewDialog from "./CardViewDialog";
import { CardAcceptDialog } from "./CardAcceptDialog";
import { CrudServices } from "../../../../Api/CrudServices";
import { Badge } from "@/components/ui/badge";
import placeholder from "../../../assets/placeholder.jpg";

export const Card = ({ type, data, onRefresh }) => {
  const crudServices = new CrudServices();

  const handleDelete = async () => {
    console.log("Deleting Post");
    alert("To be implemented");
  };

  const changeStatus = async (id, status) => {
    let requestData = {};

    // Determine which ID to use based on the type prop
    switch (type) {
      case "post":
        requestData = { postId: id, status: status };
        break;
      case "klip":
        requestData = { klipId: id, status: status };
        break;
      case "frame":
        requestData = { frameId: id, status: status };
        break;
      default:
        break;
    }

    try {
      const response = await crudServices.ChangeStatus(requestData, type);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Status Updated");
        onRefresh();
      }
    } catch (err) {
      toast.error("Couldn't update status", err);
    }
  };

  const badgeColor =
    data.status === "published" ? "bg-[#65a30d]" : "bg-[#ef4444]";
  const placeholderImage = placeholder;

  const fileUrl =
    data.files && data.files[0] ? data.files[0] : placeholderImage;
  const badgeText =
    data.status === "published" ? "Published" : "Review Requested";

  const renderMedia = (fileUrl) => {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <video
          className="h-48 w-full object-cover md:h-full md:w-48"
          src={fileUrl}
          controls
        />
      );
    } else {
      return (
        <img
          className="h-48 w-full object-cover md:h-full md:w-48"
          src={fileUrl}
          alt="Post cover"
        />
      );
    }
  };

  return (
    <div className="relative w-full mx-auto bg-white shadow-md overflow-hidden md:max-w-2xl rounded">
      <div className="md:flex h-full">
        <div className="absolute top-2 left-2">
          <Badge className={badgeColor}>{badgeText}</Badge>
        </div>
        <div className="md:shrink-0">{renderMedia(fileUrl)}</div>
        <div className="p-8 flex flex-col justify-between">
          {data.title && (
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {data.title}
            </div>
          )}
          <p className="mt-2 text-gray-500">Author: {data.institutionAuthor}</p>
          <CardViewDialog data={data} />
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <Menubar className="w-fit h-fit p-0">
          <MenubarMenu>
            <MenubarTrigger asChild className="p-1">
              <span>
                <EllipsisVertical
                  size={14}
                  className="text-gray-600 cursor-pointer"
                />
              </span>
            </MenubarTrigger>
            <MenubarContent>
              <CardEditDialog data={data} />
              <CardAcceptDialog data={data} onUpdateStatus={changeStatus} />
              <CardDeleteDialog onDelete={handleDelete} />
              <MenubarSeparator />
              <MenubarItem>Close</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};
