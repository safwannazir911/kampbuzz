import React, { useState, useEffect } from "react";
import ReelList from "./ReelList"; // imports the Reels list component to display all reels
import { PlayIcon } from "lucide-react";
import { ReelPageSkeleton } from "@/components/Loaders"; // loading animation component
import { toast } from "sonner";
import { FeedService } from "@/API/FeedService";

const Reels = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const feedServices = new FeedService();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await feedServices.getAllKlipz();
      // console.log("response", response.data.klipz);
      setVideos(response.data.klipz);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <ReelPageSkeleton />;
  }

  return (
    <div className="w-full p-2">
      <div className="font-bold text-base md:text-[32px]  mb-3 flex flex-row items-center gap-x-2">
        <div className="text-violet-500">
          <span className="text-black">K</span>lipz
        </div>
        <PlayIcon />
      </div>
      <div className="w-full flex justify-center">
        {videos.length > 0 ? (
          <ReelList videos={videos} />
        ) : (
          <div className="text-center text-lg text-gray-500">
            Currently no Klipz available, check back later
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;
