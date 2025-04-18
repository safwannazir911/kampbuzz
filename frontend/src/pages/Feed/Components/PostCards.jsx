import React, { useState, useCallback } from "react";
import Post from "./Post";
import isTouchDevice from "@/feature/isTouch";
import NotFound from "@/components/NotFound";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

function PostCards({ posts, toInstitution, isLoading, studentData }) {
  const authUser = useAuthUser();
  const [followingState, setFollowingState] = useState(
    studentData?.following || [],
  );

  if (isLoading || !studentData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const { bookmarks } = studentData;

  const handleFollowUpdate = useCallback((institutionId, isFollowing) => {
    setFollowingState((prev) =>
      isFollowing
        ? [...prev, institutionId]
        : prev.filter((id) => id !== institutionId),
    );
  }, []);

  return (
    <div className="flex flex-col items-center mt-2 overflow-hidden">
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            isTouch={isTouchDevice()}
            studentId={authUser.id}
            NavigateToInstitution={toInstitution}
            bookmarked={bookmarks.includes(post._id)}
            following={followingState.includes(
              post.institutionAuthor.institution._id,
            )}
            onFollowUpdate={handleFollowUpdate}
          />
        ))
      ) : (
        <NotFound message={"No Post to show :/"} />
      )}
    </div>
  );
}

export default PostCards;
