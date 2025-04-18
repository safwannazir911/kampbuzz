import React, { useEffect, useState, useRef } from "react";
import { Telescope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import isTouchDevice from "@/feature/isTouch";
import useNavigation from "@/feature/NavigationContext";
import NotFound from "@/components/NotFound";
import { DiscoverPageSkeleton, PostSkeleton } from "@/components/Loaders";
import { FeedService } from "@/API/FeedService";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import PostSlider from "./PostSlider";
import { Button } from "@/components/ui/button";
import LoadingSpin from "react-loading-spin";

const Explore = () => {
  const { navigateToPage } = useNavigation();
  const feedService = new FeedService();
  const authUser = useAuthUser();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [following, setFollowing] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const [currentPost, setCurrentPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [followed, setFollowed] = useState(false);

  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [seed, setSeed] = useState("");

  const [postLoading, setPostLoading] = useState(false); // New state for post click loading

  const loader = useRef(null);

  const generateRandomSeed = () => Math.random().toString(36).substring(2, 15);

  const fetchPosts = async (initialSeed) => {
    setLoading(true);
    try {
      const response = await feedService.getDiscoverPosts(1, initialSeed);
      if (response.data) {
        setPosts(response.data.posts);
        setHasMore(response.data.posts.length > 0);
        setCurrentPost(response.data.posts[0] || null);
        setPage(2);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePosts = async () => {
    setLoading(true);
    try {
      const response = await feedService.getDiscoverPosts(page, seed);
      if (response.data) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        setHasMore(response.data.posts.length > 0);
        setPage((prevPage) => prevPage + 1);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser.id) {
      const seed = generateRandomSeed();
      setSeed(seed);
      fetchPosts(seed);
    }
  }, [authUser.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader.current, hasMore, loading]);

  const fetchStudentDetails = async () => {
    try {
      const student = await feedService.getStudentDetails();
      setBookmarks(student.data.studentData.bookmarks);
      setFollowing(student.data.studentData.following);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [bookmarked, followed]);

  const handleLike = async (id) => {
    try {
      const response = await feedService.likePost(id);
      if (response.data) {
        setLiked((prevLiked) => !prevLiked);
        setLikeCount((prevLikeCount) =>
          liked ? prevLikeCount - 1 : prevLikeCount + 1,
        );
      } else {
        setError("Failed to like post");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to like post");
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const response = await feedService.bookmarkPost(postId);
      if (response.data) {
        setBookmarked((prevBookmarked) => !prevBookmarked);
      } else {
        setError("Failed to bookmark post");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to bookmark post");
    }
  };

  const handleFollow = async (institutionId) => {
    try {
      const response = await feedService.followInstitute(institutionId);
      if (response.data) {
        setFollowed((prevFollowed) => !prevFollowed);
      } else {
        setError("Failed to follow institution");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to follow institution");
    }
  };

  const handleProfileClick = (id) => {
    navigateToPage(5, id);
  };

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  const handlePostClick = async (post) => {
    setPostLoading(true); // Start loading
    try {
      const response = await feedService.getPost(post._id);
      const fetchedPost = response.data.post;

      setCurrentPost(fetchedPost);
      setLikeCount(fetchedPost.likes?.length || 0);
      setLiked(fetchedPost.likes?.includes(authUser.id) || false);
      setBookmarked(bookmarks.includes(fetchedPost._id));
      setFollowed(
        following.includes(fetchedPost.institutionAuthor?.institution?._id),
      );
    } catch (error) {
      console.error("Failed to fetch post details", error);
      setError("Failed to fetch post details");
    } finally {
      setPostLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-2 mx-auto xl:w-[85%]">
      <div className="font-bold text-base md:text-[32px] mb-3 flex-row items-center gap-x-2 hidden sm:flex">
        <div className="text-violet-500 ">
          <span className="text-black">D</span>iscover
        </div>
        <Telescope />
      </div>
      {loading && !posts.length ? (
        <DiscoverPageSkeleton />
      ) : error ? (
        <NotFound message={"Sorry! Something went wrong"} />
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 mt-2">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border rounded-sm border-gray-300 overflow-hidden aspect-square cursor-pointer"
              >
                <Dialog>
                  <DialogTrigger className="w-full">
                    {post.files ? (
                      isVideo(post.files[0]) ? (
                        <video
                          src={post.files[0]}
                          className="w-full h-auto object-cover aspect-square rounded mb-2"
                          muted
                          onClick={() => handlePostClick(post)}
                        />
                      ) : (
                        <img
                          src={post.files[0]}
                          alt="Post"
                          className="w-full h-auto object-cover aspect-square rounded mb-2"
                          onClick={() => handlePostClick(post)}
                        />
                      )
                    ) : (
                      <img
                        src="https://placehold.co/600x400/png"
                        alt="Placeholder"
                        className="w-full h-auto object-cover aspect-square rounded mb-2"
                      />
                    )}
                  </DialogTrigger>
                  <DialogContent className="p-2 w-[95vw] rounded">
                    {postLoading ? (
                      <PostSkeleton /> // Show skeleton while post is loading
                    ) : (
                      post && (
                        <DialogHeader>
                          <PostHeader
                            id={post._id}
                            handleProfileClick={() =>
                              handleProfileClick(
                                post.institutionAuthor?.institution?._id,
                              )
                            }
                            dataUpdated={post?.createdAt}
                            institutionName={
                              post.institutionAuthor?.institution?.name
                            }
                            isAlreadyFollowed={followed}
                            institutionAvatar={
                              post.institutionAuthor?.institution?.avatar
                            }
                            handleFollow={() =>
                              handleFollow(
                                post.institutionAuthor?.institution?._id,
                              )
                            }
                          />
                          <PostSlider files={post?.files} />
                          <PostFooter
                            postAuthor={
                              post.institutionAuthor?.institutionAuthor
                            }
                            title={post?.title}
                            content={post?.content}
                            id={post?._id}
                            handleLike={() => handleLike(post._id)}
                            handleBookmark={() => handleBookmark(post._id)}
                            isAlreadyLiked={liked}
                            likes={likeCount}
                            isTouch={isTouchDevice()}
                            isAlreadyBookmarked={bookmarked}
                          />
                        </DialogHeader>
                      )
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
          <div ref={loader} className="h-10 flex justify-center items-center">
            {loading && hasMore && (
              <Button variant="outline" className="gap-3" disabled>
                <LoadingSpin
                  size="small"
                  primaryColor="purple"
                  secondaryColor="pink"
                />
                Loading More...
              </Button>
            )}
          </div>
          {!hasMore && <p>No more posts</p>}
        </div>
      )}
    </div>
  );
};

export default Explore;
