import React, { useEffect, useState, useRef } from "react";
import PostCards from "../Components/PostCards";
import WordOfTheDay from "../Components/WordOfTheDay";
import useNavigation from "@/feature/NavigationContext";
import { FeedService } from "../../../API/FeedService";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import NotFound from "@/components/NotFound";
import LoadingSpin from "react-loading-spin";
import { Button } from "@/components/ui/button";
import { PostSkeleton } from "@/components/Loaders";
import { CrudServices } from "../../../API/CrudServices";

const Posts = () => {
  const { navigateToPage } = useNavigation();
  const authUser = useAuthUser();
  const feedService = new FeedService();

  const [posts, setPosts] = useState([]);
  const [categories] = useState([
    "all",
    "sports",
    "news",
    "events",
    "art",
    "hackathons",
    "technology",
    "music",
    "food",
    "architecture",
    "camping",
  ]);
  const [category] = useState(categories[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [seed, setSeed] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const loader = useRef(null);

  const crudServices = new CrudServices();

  const generateRandomSeed = () => Math.random().toString(36).substring(2, 15);

  const fetchStudentDetails = async () => {
    try {
      const response = await crudServices.getStudentDetails();
      setStudentData(response.data.studentData);
    } catch (err) {
      console.error("Error fetching student details", err);
      setError("Failed to fetch student details");
    }
  };

  const fetchPosts = async (initial = false) => {
    if (initial) setLoading(true);
    else setLoadingMore(true);
    const excludedPostIds = posts.map((post) => post._id);

    try {
      const response = await feedService.getAllFeedPosts(page, seed, excludedPostIds);
      if (response.data) {
        setPosts((prevPosts) =>
          initial
            ? response.data.posts
            : [...prevPosts, ...response.data.posts],
        );
        setHasMore(response.data.posts.length > 0);
        setPage((prevPage) => prevPage + 1);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts", error);
      setError("Failed to fetch posts");
    } finally {
      if (initial) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (authUser.id) {
      const newSeed = generateRandomSeed();
      setSeed(newSeed);
      // fetchPosts(true);
      fetchStudentDetails().then(() => fetchPosts(true));
    }
  }, [authUser.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPosts();
        }
      },
      { rootMargin: "100px", threshold: 0.1 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader.current, hasMore, loading, loadingMore]);

  const handleInstitutionClick = (id) => {
    navigateToPage(5, id);
  };

  const LoadingSkeleton = () => {
    return (
      <div className="w-[90%] sm:w-[75%] md:w-[70%] lg:w-[60%] xl:w-[50%]">
        <PostSkeleton />
      </div>
    );
  };

  return (
    <div className="w-[100%] flex flex-col md:m-0 mt-5 items-center">
      <WordOfTheDay />
      {loading && !posts.length ? (
        <LoadingSkeleton />
      ) : error ? (
        <NotFound message={"Sorry! Something went wrong"} />
      ) : (
        <div>
          <PostCards
            posts={posts}
            toInstitution={handleInstitutionClick}
            isLoading={loading}
            studentData={studentData}
          />
          <div ref={loader} className="h-10 flex justify-center items-center">
            {loadingMore && hasMore && (
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

export default Posts;
