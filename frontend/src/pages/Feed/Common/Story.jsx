import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// StoryClose Component
export function StoryClose({ thumbnail, avatar, name, handleOpen, index }) {
  const handleStoryOpen = () => {
    handleOpen(index);
  };

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="flex flex-col items-center" onClick={handleStoryOpen}>
      <div className="flex flex-col items-center min-w-[120px] min-h-[220px] md:w-[150px] md:h-[250px] max-w-[150px] max-h-[250px] md:max-w-[150px] md:max-h-[250px] m-2 rounded-xl border-rose-500">
        {isVideo(thumbnail) ? (
          <video
            src={thumbnail}
            className="w-full h-full rounded-xl object-cover outline outline-offset-0 outline-3 outline-violet-300"
            muted
          />
        ) : (
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="w-full h-full rounded-xl object-cover outline outline-offset-0 outline-3 outline-violet-300"
          />
        )}

        <Avatar className="mt-[-35%] outline outline-offset-2 outline-1 outline-rose-400 cursor-pointer z-10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      {/* <div className="mb-3 w-full text-center">
        <p
          className="w-full truncate"
          style={{
            maxWidth: "150px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </p>
      </div> */}
    </div>
  );
}

// StoryOpen Component
export function StoryOpen({ handleClose, data = [], owner, owneravatar }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // State for progress bar

  useEffect(() => {
    let timer;
    if (!isVideo(data[currentIndex])) {
      const duration = 15000; // 15 seconds for images
      const interval = duration / 100; // Calculate interval for updating the progress

      setProgress(0); // Reset progress at the start

      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            handleNext();
            return 0; // Reset progress after reaching 100%
          }
          return prevProgress + 1;
        });
      }, interval);
    }

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex, data]);

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1,
    );
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };

  if (data.length === 0) return null; // Handle the case where data is empty

  return (
    <div
      className="flex h-full justify-center items-center p-2"
      onClick={handleClose}
    >
      <div
        className="w-full h-full sm:w-[50vw] sm:h-[80vh] lg:w-[35vw] xl:w-[25vw] m-0 md:m-2 rounded-2xl relative"
        onClick={handleClick}
      >
        <div
          className="absolute right-0 m-2 z-[99] sm:hidden bg-white rounded-full"
          style={{ color: "none" }}
          onClick={handleClose}
        >
          <X width={30} height={30} />
        </div>
        <div className="flex items-center absolute z-50 ml-3 mt-3">
          <Avatar className="outline outline-offset-2 outline-1 outline-rose-400 cursor-pointer z-10">
            <AvatarImage src={owneravatar} alt={owner} />
            <AvatarFallback>{owner.charAt(0)}</AvatarFallback>
          </Avatar>

          <div>
            <span className="font-xs font-bold text-white ml-2">{owner}</span>
          </div>
        </div>

        {/* Conditionally render progress bar */}
        {!isVideo(data[currentIndex]) && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
            <div
              className="h-full bg-violet-600 transition-all duration-[15s]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="w-full h-full flex justify-center items-center">
          {isVideo(data[currentIndex]) ? (
            <video
              key={`${data[currentIndex]}?index=${currentIndex}`}
              className="w-full h-full object-cover border-violet-200 rounded-lg"
              autoPlay
              onEnded={handleVideoEnd}
            >
              <source src={data[currentIndex]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={data[currentIndex]}
              alt={`story-${currentIndex}`}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
          {data.length > 1 && (
            <>
              <Button
                variant="outline"
                onClick={handlePrev}
                className="bg-violet-400 text-white rounded-full"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                className="bg-violet-400 text-white rounded-full"
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
