import React, { useState, useRef, useEffect } from "react";
import {
  LucideArrowUpFromLine,
  LucideCircleX,
  LucideVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudServices } from "../../../../../Api/CrudServices";
import { toast } from "sonner";

const FramezVideoUploader = () => {
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const fileUploadRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const crudServices = new CrudServices();

  const handleVideoUpload = (event) => {
    event.preventDefault();
    fileUploadRef.current.click(); // Trigger file input click
  };

  /*
    video player libs: 
    1. https://github.com/surmon-china/videojs-player
    2. https://github.com/triyanox/react-video         (i think this one is good)
  */

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setVideo(uploadedFile);
    setVideoURL(URL.createObjectURL(uploadedFile));
    event.target.value = null;
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("files", video);
    setLoading(true);
    try {
      const response = await crudServices.publishFramez(formData);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.data.message);
        setVideo(null);
        setVideoURL(null);
        fileUploadRef.current.value = null;
        console.log(response.data);
      }
    } catch (err) {
      toast.error("Error uploading video", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setVideo(null);
    setVideoURL(null);
    fileUploadRef.current.value = null;
  };

  useEffect(() => {
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [videoURL]);

  return (
    <>
      <div className="text-2xl font-semibold text-center mb-2">
        Upload New Framez
      </div>
      <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg block">
        <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex justify-center items-center">
            <input
              type="file"
              id="file"
              ref={fileUploadRef}
              onChange={handleFileChange}
              hidden
              accept="video/*"
            />
            {video ? (
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                controls
                src={videoURL}
              />
            ) : (
              <p>Upload Framez</p>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-center items-center">
            <Button
              variant={"outline"}
              onClick={handleVideoUpload}
              disabled={video}
            >
              <LucideVideo size={24} className="mr-2" /> Choose Framez
            </Button>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={loading || !video}
            >
              <LucideCircleX size={16} className="mr-2" />
              Discard
            </Button>
            {loading ? (
              <Button disabled={loading}>Submitting...</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!video}>
                <LucideArrowUpFromLine size={16} className="mr-2" />
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FramezVideoUploader;
