import React, { useState, useEffect } from "react";
import PostHeader from "./PostHeader";
import PostSlider from "./PostSlider";
import PostFooter from "./PostFooter";
import { FeedService } from "@/API/FeedService";
import { Link } from "react-router-dom";

const Post = ({
  post,
  isTouch,
  studentId,
  NavigateToInstitution,
  bookmarked,
  following,
  onFollowUpdate,
}) => {
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(studentId));
  const [isBookmarked, setBookmarked] = useState(bookmarked);
  const feedService = new FeedService();

  const isSponsored = post._id === "66475cb07e2e3e659137e8e7";

  useEffect(() => {
    setLiked(post.likes.includes(studentId));
  }, [post.likes, studentId]);

  const handleLike = async () => {
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    setLiked((prevLiked) => !prevLiked);
    try {
      await feedService.likePost(post._id);
    } catch (error) {
      console.error(error);
      setLiked((prevLiked) => !prevLiked);
    }
  };

  const handleBookmark = async () => {
    setBookmarked((prev) => !prev);
    try {
      await feedService.bookmarkPost(post._id);
    } catch (error) {
      console.error(error);
      setBookmarked((prev) => !prev);
    }
  };

  const handleProfileClick = (institutionId) => {
    NavigateToInstitution(institutionId);
  };

  const handleFollow = async (institutionId) => {
    try {
      await feedService.followInstitute(institutionId);
      onFollowUpdate(institutionId, !following);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`shadow ${
        isSponsored ? "shadow-purple-200" : ""
      } rounded-md mb-2.5 w-[90%] sm:w-[75%] md:w-[70%] lg:w-[60%] xl:w-[50%] p-3`}
    >
      <PostHeader
        id={post._id}
        institutionName={post.institutionAuthor?.institution?.name || "NA"}
        institutionAvatar={post.institutionAuthor?.institution?.avatar || "NA"}
        handleProfileClick={() =>
          handleProfileClick(post.institutionAuthor?.institution?._id || "NA")
        }
        dataUpdated={post.createdAt}
        isSponsored={isSponsored}
        handleFollow={() => {
          handleFollow(post.institutionAuthor?.institution._id || "NA");
        }}
        isAlreadyFollowed={following}
      />
      <Link to={`/feed/${post._id}`}>
        <PostSlider files={post.files} />
      </Link>
      <PostFooter
        title={post.title}
        content={post.content}
        id={post._id}
        postAuthor={post.institutionAuthor?.institutionAuthor || "NA"}
        handleLike={handleLike}
        handleBookmark={handleBookmark}
        isAlreadyLiked={liked}
        isAlreadyBookmarked={isBookmarked}
        likes={likeCount}
        isTouch={isTouch}
        isSponsored={isSponsored}
      />
    </div>
  );
};

export default Post;