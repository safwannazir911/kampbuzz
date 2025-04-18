import React, { useEffect, useRef, useCallback } from "react";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "../styles/styles.css";
import { Copy } from "lucide-react";

export default function PostSlider({ files }) {
  const videoRefs = useRef([]);

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.25,
    });

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, [handleIntersection]);

  const renderMedia = (file, index) => {
    const isVideo = /\.(mp4|webm|ogg|avi)$/.test(file);
    if (isVideo) {
      return (
        <video
          key={index}
          ref={(el) => (videoRefs.current[index] = el)}
          controls
          src={file}
          className="w-full h-auto object-cover mt-4 aspect-square rounded-lg"
        />
      );
    } else {
      return (
        <img
          key={index}
          src={file}
          alt={`Media ${index}`}
          className="w-full h-auto object-cover mt-4 aspect-square rounded-lg"
        />
      );
    }
  };

  const handleSlideChange = (event) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === event.currentIndex) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  };

  return (
    <>
      {files.length === 1 ? (
        <div style={{ borderRadius: "10px" }}>{renderMedia(files[0], 0)}</div>
      ) : (
        <div className="relative">
          <div className="absolute top-2 right-2 z-10 ">
            <Copy size={"20px"} />
          </div>

          <AwesomeSlider
            bullets={false}
            className="aws-btn mt-2"
            onTransitionEnd={handleSlideChange}
          >
            {files.map((file, index) => (
              <div key={index} style={{ borderRadius: "10px" }}>
                {renderMedia(file, index)}
              </div>
            ))}
          </AwesomeSlider>
        </div>
      )}
    </>
  );
}
