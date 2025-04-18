import React, { useEffect, useState } from "react";
import { TrendingUp, Megaphone, ExternalLink } from "lucide-react";
import advert1 from "../../../asset/advert_2.jpg";
import useNavigation from "@/feature/NavigationContext";
import { FeedService } from "@/API/FeedService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmoji } from "@/constants/emoji-likes";

const RightSection = () => {
  const [loading, setLoading] = useState(false);
  const [popularPosts, setPopularPosts] = useState([]);

  const feedServices = new FeedService();

  // i have kept place holder profile pics for now
  const suggestionsData = [
    {
      _id: "663db54acc1bbc7d8003f658",
      name: "Islamic University",
      suggested: "Suggested for you",
      profilePic:
        "https://www.timeshighereducation.com/student/sites/default/files/harvard-university-campus.jpg",
    },
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await feedServices.getPostsWithMaxLikes();
      // console.log(response.data.posts);
      if (response.error) {
        toast.error("Error fetching posts");
      } else {
        findPopularPostsByLikes(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const findPopularPostsByLikes = (posts) => {
    const sortedPosts = posts.sort((a, b) => b.likes.length - a.likes.length);
    const topPosts = sortedPosts.slice(0, 5);
    setPopularPosts(topPosts);
  };

  // console.log("Popular", popularPosts);

  // use Navigation hook
  const { navigateToPage } = useNavigation();

  //Handle Profile click logic
  const handleProfileClick = (id) => {
    navigateToPage(5, id);
  };

  // Utility function to separate the main text from the hashtags using regex
  const formatWithBlueHashtags = (text) => {
    const [mainText, ...hashtags] = text.split(/(#[^\s]+)/);
    return (
      <div>
        <div>{mainText}</div>
        <div className="text-xs lg:text-sm  text-blue-500">
          {hashtags.map((hashtag, index) => (
            <span key={index}>{hashtag}</span>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="flex justify-center items-center flex-col fixed">
      <div className="w-[90%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] m-0.5 lg:m-1 bg-white border rounded-lg ">
        <div className="flex flex-row gap-x-2 items-center my-4">
          <h2 className="sm:text-sm md:text-xl xl:text-2xl ml-2 font-semibold">
            Sponsored
          </h2>
          <Megaphone className="text-violet-500" />
        </div>
        <div>
          <div className="m-1 relative">
            <a href="https://www.instagram.com/" target="_blank">
              <img
                src={advert1}
                alt="Ad 1"
                className="w-full h-auto object-cover rounded"
              />
            </a>
            <div className="absolute top-0 right-0">
              <a href="https://www.instagram.com/" target="_blank">
                <ExternalLink className="text-violet-500" size={"20"} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-x-2 items-center overflow-hidden my-4">
          <h2 className="sm:text-sm md:text-xl xl:text-2xl ml-2 font-semibold">
            Buzzing
          </h2>
          <TrendingUp className="text-violet-500" />
        </div>

        <ul className="space-y-0 mb-4 p-0 h-fit overflow-y-scroll no-scrollbar">
          {loading ? (
            <div className="space-y-5 flex flex-col">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            popularPosts.map((item, index) => (
              <li
                key={index}
                className="text-xs lg:text-sm p-2 bg-white rounded shadow-sm"
              >
                <Link to={`/feed/${item._id}`}>
                  <div className="flex gap-2">
                    {getEmoji(item.likes.length)}
                    {formatWithBlueHashtags(item.title)}
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
        <h2 className="sm:text-sm md:text-xl xl:text-2xl font-semibold ml-2 mb-4">
          Buzz4U
        </h2>
        <ul className="space-y-0  mb-4 p-0 h-fit overflow-y-scroll no-scrollbar">
          {suggestionsData.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-start p-2 bg-white rounded shadow-sm cursor-pointer"
              onClick={() => handleProfileClick(item._id)}
            >
              {/* Profile Picture(place holder) */}
              <img
                src={item.profilePic}
                alt={`${item.name} profile`}
                className="outline outline-offset-2 outline-1 outline-rose-400 cursor-pointer w-10 h-10 rounded-full mr-3"
              />
              {/* Name and Suggested Text(from dummy data/suggestionsData) */}
              <div>
                <div className="text-xs lg:text-sm  font-bold">{item.name}</div>
                <div className="text-xs lg:text-sm  text-gray-600">
                  {item.suggested}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs lg:text-sm text-muted-foreground">
        © 2024 Kamp Buzz
      </p>
    </div>
  );
};

export default RightSection;
