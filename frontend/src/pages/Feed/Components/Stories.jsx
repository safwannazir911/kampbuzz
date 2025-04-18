import React, { useEffect, useState } from "react";
import { StoryClose, StoryOpen } from "../Common/Story"; // Import your components
import { FeedService } from "@/API/FeedService";
import LoadingSpin from "react-loading-spin";
import { Button } from "@/components/ui/button";

const Stories = () => {
  const [allStories, setAllStories] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [openedStoryIndex, setOpenedStoryIndex] = useState(null); // State to track opened story index

  const feedServices = new FeedService();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await feedServices.getAllFramez();
      setAllStories(flattenStories(response.data.framez));
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const flattenStories = (institutions) => {
    return institutions.flatMap((institution) =>
      institution.framez.map((story) => ({
        ...story,
        institutionName: institution.institutionName,
        institutionAvatar: institution.institutionAvatar || "NA", // Use a default avatar if not available
      })),
    );
  };

  const openStory = (index) => {
    setOpenedStoryIndex(index);
  };

  const closeStory = () => {
    setOpenedStoryIndex(null);
  };

  if (isLoading) {
    return (
      <div className="w-fit-content flex justify-center">
        <Button variant="outline" className="gap-3" disabled>
          <LoadingSpin
            size="small"
            primaryColor="purple"
            secondaryColor="pink"
          />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 pt-0">
      {allStories.length > 0 && (
        <div>
          <div className="font-bold text-[24px] md:text-[32px] text-violet-500">
            <span className="text-[#000]">F</span>ramez
          </div>
          <div className="flex flex-row justify-start overflow-x-auto no-scrollbar">
            {allStories.map((story, index) => (
              <StoryClose
                key={story._id}
                index={index}
                thumbnail={story.files[0]} // Assuming files array is not empty
                name={story.institutionName}
                avatar={story.institutionAvatar}
                handleOpen={() => openStory(index)}
              />
            ))}
          </div>
        </div>
      )}
      {openedStoryIndex !== null && allStories[openedStoryIndex] && (
        <div
          className="fixed inset-0 bg-[#4a4a4ac9] flex justify-center items-center z-40"
          onClick={closeStory}
        >
          <StoryOpen
            handleClose={closeStory}
            data={allStories[openedStoryIndex].files} // Directly pass files array
            owner={allStories[openedStoryIndex].institutionName}
            owneravatar={allStories[openedStoryIndex].institutionAvatar}
          />
        </div>
      )}
    </div>
  );
};

export default Stories;
