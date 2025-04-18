import React, { useState, useRef } from "react";
import { Heart, MessageCircle, Send, Plus, Minus } from "lucide-react"; // icons for post preview not functionality attached to them
import AwesomeSlider from "react-awesome-slider"; // Image slider
import "react-awesome-slider/dist/styles.css"; // default stylesheet for slider
import CustomAlert from "@/components/common/CustomAlert"; // Custom Alert pop up
import { CrudServices } from "../../../../Api/CrudServices";
import ReactSelect from "react-select"; // for tags
import { interests } from "@/lib/data"; // Default values for tags
import "../styles/styles.css"; // Importing custom styles for image slider
import { toast } from "sonner";

const CreatePost = () => {
  const crudServices = new CrudServices(); // Create an instance of CrudServices
  const [images, setImages] = useState([]); // State to manage uploaded images
  const [Title, setTitle] = useState(""); // State to manage the post title
  const [Content, setContent] = useState(""); // State to manage the post content
  const [Tags, setTags] = useState([]); // State to manage the post tags
  const [alert, setAlert] = useState(null); // State to manage alerts
  const fileUploadRef = useRef(null); // Ref to handle file input
  const [activeCall, setActiveCall] = useState(false); // Can be used to implement a loading screen after making an API call

  /**
   * IMPORTANT
   * Working with images is limited to front-end only as of now
   */

  /**
   * @name handleImageUpload
   * Function prevents the default event behavior and triggers a click on a file input element.
   */
  const handleImageUpload = (event) => {
    event.preventDefault();
    fileUploadRef.current.click(); // Trigger file input click
  };

  /**
   * @name handleFileChange
   * This function takes an event containing uploaded files, converts them to an array,
   * and appends them to the existing list of images.
   */
  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setImages((prev) => [...prev, ...uploadedFiles]); // Append new files to the current list
    event.target.value = null; // Clear the input value
  };

  /**
   * @name handleDeleteUpload
   * This function removes a selected image from a list of images in a React component.
   */
  const handleDeleteUpload = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages); // Remove the selected image from the list
  };

  /**
   * @name handleRequestReview
   * Theis function  handles the submission of a post, checking for missing fields, creating form data, and calling an API to create a post with error handling.
   * @returns The  function returns either an alert message indicating missing fields if the `Title` or `Content` field is empty, or it attempts to create a new post with the
   * provided data and handles any errors that may occur during the process.
   */
  const handleRequestReview = async () => {
    /**
     * If either the `Title` or `Content` field is empty,
     * sets an alert message indicating that the required fields are missing.
     */
    if (!Title || !Content) {
      setAlert({
        title: "Missing Fields",
        content: "Title and Content are required to save the post.",
      });
      return;
    }

    const formData = new FormData(); // Creating a new Form instance
    formData.append("title", Title); // Adding title
    formData.append("content", Content); // Adding content
    Tags.forEach((tag) => formData.append("tags", tag.value)); // Adding tags

    // FOR LATER IMPLEMENTATION
    images.forEach((image) => {
      formData.append("files", image, image.name);
    });

    // temporaryfix
    // This enables to upload one image to the backend
    // formData.append("file", images[0]);

    try {
      setActiveCall(true);
      const response = await crudServices.CreatePost(formData); // Using the Common API instance to call createPost

      // Checks for any error
      if (response.error) {
        setAlert({
          title: "Error",
          content: `Failed to save post: ${
            response.data.message || response.statusText
          }`,
        });
      } else {
        setTitle("");
        setContent("");
        setTags([]);
        setImages([]);
        toast.success("Post Saved!");
      }
    } catch (error) {
      setAlert({
        title: "Error",
        content: `An error occurred while saving the post: ${error.message}`,
      });
    } finally {
      setActiveCall(false);
    }
  };

  // To be implemented
  const handleSave = () => {
    console.log("Hit Save");
  };

  // Function to handle clear all
  const handleDelete = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setImages([]); // Clear the post details
  };

  return (
    <>
      <div className="text-2xl font-semibold text-center mb-2">
        Create New Post
      </div>
      {alert && (
        <CustomAlert
          title={alert.title}
          description={alert.content}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg block">
        <div className="relative h-64 bg-gray-200 flex justify-center items-center">
          <div className="absolute flex bg-white left-[45%] z-10 bottom-3  p-2 rounded-md shadow-md">
            <Plus className="p-1 cursor-pointer" onClick={handleImageUpload} />
          </div>
          <input
            type="file"
            id="file"
            ref={fileUploadRef}
            onChange={handleFileChange}
            multiple
            hidden
          />
          {images.length > 0 ? (
            <AwesomeSlider
              bullets={false}
              infinite={false}
              className="w-full h-full aws-btn"
            >
              {images.map((image, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Slide ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <Minus
                    className="absolute top-2 right-2 cursor-pointer  bg-white p-1 rounded-full shadow-md"
                    onClick={() => handleDeleteUpload(index)}
                  />
                </div>
              ))}
            </AwesomeSlider>
          ) : (
            <p>No images uploaded</p>
          )}
        </div>
        <div className="p-4">
          <div className="flex text-xl mb-4">
            <Heart className="mr-4" />
            <MessageCircle className="mr-4" />
            <Send />
          </div>
          <input
            type="text"
            placeholder="Add Title..."
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Add Content..."
            rows={4}
            value={Content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
          <ReactSelect
            isMulti
            options={interests}
            value={Tags} // Maintain selected tags state
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
          <div className="flex justify-center space-x-4 mt-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={handleDelete}
            >
              Clear All
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-md"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-900 text-white px-4 py-2 rounded-md"
              onClick={handleRequestReview}
              disabled={activeCall}
            >
              Request Review
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
