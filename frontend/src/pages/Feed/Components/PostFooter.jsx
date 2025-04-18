import React, { useState } from "react";
import { Heart, Forward, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

function PostFooter({
  institutionName,
  postAuthor,
  title,
  content = "",
  id,
  handleLike,
  handleBookmark,
  isAlreadyLiked,
  isAlreadyBookmarked,
  likes,
  isTouch,
  isSponsored,
}) {
  const truncatedContent = content.split(" ").slice(0, 30).join(" ");
  const remainingContent = content.split(" ").slice(30).join(" ");

  const [showFullContent, setShowFullContent] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: content,
          url: `${window.location.href}/${id}`,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Web Share API is not supported in this browser.");
    }
  };

  return (
    <>
      <div className="mx-1.5 mt-1.5 bg-white">
        <div className="flex justify-between mt-4">
          <div className="flex flex-row gap-x-">
            <div className="flex flex-col gap-y-1">
              <Heart
                className={`cursor-pointer transition duration-75 ${
                  isAlreadyLiked
                    ? "text-rose-400 fill-rose-400 animate-bounce-once"
                    : ""
                } ${!isTouch ? "hover:text-rose-400 hover:fill-rose-400" : ""}`}
                onClick={() => {
                  handleLike(id);
                }}
              />
              <p className="text-base text-muted-foreground">{`${likes} ${
                likes === 1 ? "like" : "likes"
              }`}</p>
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <Forward
              className="cursor-pointer text-black hover:text-blue-500"
              onClick={handleShare}
            />

            <Bookmark
              className={`cursor-pointer transition duration-75 ${
                isAlreadyBookmarked
                  ? "text-violet-400 fill-violet-400 animate-bounce-once"
                  : ""
              } ${
                !isTouch ? "hover:text-violet-400 hover:fill-violet-400" : ""
              }`}
              onClick={() => {
                handleBookmark(id);
              }}
            />
          </div>
        </div>
      </div>
      <div className="mx-1.5 mb-1.5 text-left">
        {/* <span className="font-semibold text-base xl:text-sm text-black">
          {isSponsored ? "Red Bull Racing " : institutionName}
        </span> */}
        <span className="text-xs text-gray-500 flex">By: {postAuthor}</span>
        <Link to={`/feed/${id}`}>
          <span className="font-semibold flex font-serif text-lg">{title}</span>
        </Link>
        <span className="text-gray-600 text-sm xl:text-base mb-1">
          {showFullContent ? content : truncatedContent}
          {remainingContent && (
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? " (show less)" : "... (more)"}
            </span>
          )}
        </span>
      </div>
    </>
  );
}

export default PostFooter;
