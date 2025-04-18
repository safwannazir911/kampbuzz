import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getTimePassed } from "../../../lib/getTimePassed";
import { Badge } from "@/components/ui/badge";
///TODO:: we need to pass the prop for image also...
export default function PostHeader({
  id,
  institutionName,
  handleProfileClick,
  dataUpdated,
  isSponsored,
  handleFollow,
  isAlreadyFollowed,
  institutionAvatar,
}) {
  return (
    <div className="p-1 flex justify-start items-start">
      <div className="flex flex-row gap-x-1.5 items-center">
        <Avatar
          className="outline outline-offset-2 outline-1 outline-rose-400 cursor-pointer z-10"
          onClick={handleProfileClick}
        >
          <AvatarImage src={institutionAvatar} alt={institutionName} />
          <AvatarFallback>{institutionName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <h4
            className="text-sm cursor-pointer mr-1"
            onClick={handleProfileClick}
          >
            {isSponsored ? "Red Bull Racing" : institutionName}
          </h4>
          <p className="text-xs text-gray-500">{getTimePassed(dataUpdated)}</p>
        </div>
      </div>

      <div>
        {isSponsored && (
          <Badge
            variant="outline"
            style={{ backgroundColor: "#4338ca", color: "white" }}
          >
            Sponsored
          </Badge>
        )}
        <Badge
          onClick={handleFollow}
          className="font-light cursor-pointer p-2 ml-4"
          // style={{ backgroundColor: "#4338ca", color: "white" }}
          variant={isAlreadyFollowed ? "secondary" : "outline"}
        >
          {isAlreadyFollowed ? "Following" : "Follow"}
        </Badge>
      </div>
    </div>
  );
}
