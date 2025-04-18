import React from "react";
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
import { Badge } from "../../../components/ui/badge";
import placeholder from "../../../assets/placeholder.jpg";

function PostViewDialog({ data }) {
  const placeholderImage = placeholder;
  const fileUrl =
    data.files && data.files[0] ? data.files[0] : placeholderImage;

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">
          <span className="mr-2 font-normal">View</span>
          <Eye size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 w-[95vw] rounded">
        <DialogHeader>
          {renderMedia(fileUrl)}
          <DialogTitle>{data.title}</DialogTitle>
          <DialogDescription>{data.content}</DialogDescription>
        </DialogHeader>

        <div>
          {data.tags && (
            <h2 className="text-sm text-indigo-500 font-semibold mb-2">Tags</h2>
          )}
          {data.tags &&
            data.tags.map((tag, index) => (
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
