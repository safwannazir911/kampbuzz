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
import { Badge } from "@/components/ui/badge";
import placeholder from "@/assets/placeholder.jpg";
import { CrudServices } from "../../../../../Api/CrudServices";

export const Card = ({ type, data, postAuthor, onRefresh }) => {
  // console.log("Card Data", data);

  const [loading, setLoading] = React.useState(false);
  const crudServices = new CrudServices();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await crudServices.DeletePost(data._id);
      if (response.error) throw new Error("Something Went Wrong!");
      toast.success("Post deleted successfully");
      onRefresh();
    } catch (err) {
      console.log(err);
      toast.error("Error deleting post");
    } finally {
      setLoading(false);
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
          <Badge className={badgeColor }>{badgeText}</Badge>
        </div>
        <div className="md:shrink-0">{renderMedia(fileUrl)}</div>
        <div className="p-8 flex flex-col justify-between">
          {data.title && (
            <div className="capitalize tracking-wide text-sm text-indigo-500 font-semibold">
              {data.title}
            </div>
          )}
          <p className="mt-2 text-gray-500">Author: {postAuthor}</p>
          <div className="flex">
            <CardViewDialog data={data} type={type} />
          </div>
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
              {type === "post" && (
                <CardEditDialog post={data} onRefresh={onRefresh} />
              )}
              <CardDeleteDialog onDelete={handleDelete} />
              <MenubarSeparator />
              <MenubarItem className="cursor-pointer">Close</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};
