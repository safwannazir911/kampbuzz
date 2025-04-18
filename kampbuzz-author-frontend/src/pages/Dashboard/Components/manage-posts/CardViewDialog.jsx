import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import placeholder from "@/assets/placeholder.jpg";

function PostViewDialog({ data, type }) {
  const placeholderImage = placeholder;
  const fileUrl =
    data?.files && data?.files[0] ? data?.files[0] : placeholderImage;

  const badgeColor =
    data.status === "published" ? "bg-[#65a30d]" : "bg-[#ef4444]";

  const hoverColor =
    data.status === "published" ? "hover:bg-green-700" : "hover:bg-red-700";

  const renderMedia = (fileUrl) => {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <video
          className="w-full h-auto object-cover aspect-square rounded mb-2"
          src={fileUrl}
          controls
        />
      );
    } else {
      return (
        <img
          className="w-full h-auto object-cover aspect-square rounded mb-2"
          src={fileUrl}
          alt="Post cover"
        />
      );
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`mt-4 ${badgeColor} ${hoverColor}`}>
          <Eye size={16} className="mr-2" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 w-[95vw] rounded">
        <DialogHeader>
          {renderMedia(fileUrl)}
          <DialogTitle>{data?.title}</DialogTitle>
          {type === "post" && (
            <DialogDescription className="truncate text-ellipsis">
              {isExpanded
                ? data?.content
                : `${data?.content?.substring(0, 50)}...`}
              {data?.content?.length > 20 && (
                <Button
                  variant="link"
                  className="ml-1 text-blue-500"
                  onClick={handleToggleExpand}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </Button>
              )}
            </DialogDescription>
          )}
        </DialogHeader>

        <div>
          {data?.tags && (
            <h2 className="text-sm text-indigo-500 font-semibold mb-2">Tags</h2>
          )}
          {data?.tags &&
            data?.tags?.map((tag, index) => (
              <Badge
                className="cursor-pointer mr-1"
                variant="outline"
                key={index}
              >
                {tag}
              </Badge>
            ))}
        </div>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="button">Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PostViewDialog;
