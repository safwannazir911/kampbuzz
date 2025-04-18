import React, { useRef, useState } from "react";
import ReactVisibilitySensor from "react-visibility-sensor";
import {
  Heart,
  MessageCircle,
  ShareIcon,
  Bookmark,
  PlayCircle,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { imageUrl } from "@/constants/imageUrls";

const ReelCard = ({ video }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const videoRef = useRef(null);

  const handleVisibilityChange = (isVisible) => {
    setIsVisible(isVisible);
    setIsPlaying(true);
    if (isVisible) {
      videoRef.current.classList.remove("blur-sm");
      videoRef.current.play();
    } else {
      videoRef.current.classList.add("blur-sm");
      videoRef.current.pause();
    }
  };

  const handlePause = (e) => {
    e.preventDefault();
    setIsPlaying(!isPlaying);
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateDescription = (description, limit) => {
    if (description.length > limit) {
      return description.slice(0, limit) + " ...";
    } else {
      return description;
    }
  };

  const getMimeType = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "mp4":
        return "video/mp4";
      case "webm":
        return "video/webm";
      case "mkv":
        return "video/x-matroska";
      default:
        return "video/mp4";
    }
  };

  return (
    <div
      className="shadow-xl mt-5 relative min-w-[320px] min-h-[520px] md:w-[150px] md:h-[250px] max-w-[150px] max-h-[250px] md:max-w-[150px] md:max-h-[250px] rounded-xl border-rose-500 bg-[#e1e1e1]"
      onClick={handlePause}
    >
      <ReactVisibilitySensor onChange={handleVisibilityChange}>
        <video
          autoPlay={isVisible}
          loop
          className="object-cover min-w-full min-h-full h-[520px] rounded-xl blur-sm"
          ref={videoRef}
        >
          <source src={video.files[0]} type={getMimeType(video.files[0])} />
          Your browser does not support the video tag.
        </video>
      </ReactVisibilitySensor>
      <div className="absolute top-[45%] left-[45%] w-[54px] h-[54px]">
        {!isPlaying && (
          <PlayCircle className="text-[#e8e6e6] w-full h-full cursor-pointer" />
        )}
      </div>
      <div className="absolute bottom-1 w-full">
        <div className="flex m-3 justify-start items-center">
          <Avatar className="outline outline-offset-2 outline-1 outline-rose-400 h-8 w-8">
            <AvatarImage src={imageUrl} alt={"kampbuzz User"} />
          </Avatar>
          <div className="ml-2">
            <div className="text-xs lg:text-sm text-white font-bold drop-shadow">
              {video.institutionAuthor.institution.name}
            </div>
            <div className="text-xs lg:text-sm text-white drop-shadow-xl">
              {showFullDescription
                ? video.content
                : truncateDescription(video.content, 30)}
              {!showFullDescription && video.content.length > 30 && (
                <span
                  className="text-white font-bold cursor-pointer"
                  onClick={toggleDescription}
                >
                  {" "}
                  Read more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-3 bottom-[4.5rem]">
        <div className="flex flex-col">
          <div className="rounded-full bg-violet-400 p-2 mb-2">
            <Heart className="text-white" strokeWidth={3} />
          </div>
          <div className="rounded-full bg-violet-400 p-2 mb-2">
            <MessageCircle className="text-white" strokeWidth={3} />
          </div>
          <div className="rounded-full bg-violet-400 p-2 mb-2">
            <ShareIcon className="text-white" strokeWidth={3} />
          </div>
          <div className="rounded-full bg-violet-400 p-2 mb-2">
            <Bookmark className="text-white" strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
