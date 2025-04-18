import React, { useState, useRef, useEffect } from "react";
import {
  LucideArrowUpFromLine,
  LucideCircleX,
  LucideVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactSelect from "react-select";
import { interests } from "@/lib/data";
import { CrudServices } from "../../../../../Api/CrudServices";
import { toast } from "sonner";

const KlipzVideoUploader = () => {
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
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
    formData.append("content", content);
    formData.append("tags", tags.map((tag) => tag.value).join(","));
    setLoading(true);
    try {
      const response = await crudServices.publishKlipz(formData);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.data.message);
        // console.log("Klipz Submit", response.data);
        setVideo(null);
        setVideoURL(null);
        setContent("");
        setTags([]);
        fileUploadRef.current.value = null;
      }
    } catch (error) {
      console.error("Klipz Submit Error", error);
      toast.error("Failed to upload Klipz");
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
        Upload Klipz
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
              <p>Select your Klipz</p>
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
              <LucideVideo size={24} className="mr-2" /> Choose Klipz
            </Button>
          </div>
          <div className="mt-2">
            <textarea
              placeholder="Add Content..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
            <ReactSelect
              isMulti
              options={interests}
              value={tags} // Maintain selected tags state
              placeholder="Add Tags"
              onChange={(selectedOptions) => {
                setTags(selectedOptions);
              }}
              className="z-20"
              menuPlacement="auto"
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  color: "grey", // Set placeholder color to black
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  color: "grey", // Set dropdown icon color to black
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#ddd1f9", // Set background color of selected items to purple
                  borderRadius: "20px", // Set rounded borders
                }),
              }}
            />
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

export default KlipzVideoUploader;
