import React, { useState } from "react";
import CreatePost from "./CreatePost";
import { Button } from "@/components/ui/button";
import { LucideArrowLeft } from "lucide-react";
import CreateKlipz from "./CreateKlipz";
import CreateFramez from "./CreateFramez";

const SelectPostType = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container mx-auto p-4">
      {!selectedOption ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-4">Choose an Option</h1>
          <Button
            className="px-8 py-4 rounded-md mb-2"
            variant={"destructive"}
            onClick={() => handleSelection("createPost")}
          >
            Create Post
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-md mb-2"
            onClick={() => handleSelection("createKlipz")}
          >
            Create Klips
          </Button>
          <Button
            className="bg-purple-500 hover:bg-purple-700 text-white px-8 py-4 rounded-md"
            onClick={() => handleSelection("createFramez")}
          >
            Create Framz
          </Button>
        </div>
      ) : (
        <>
          <Button
            className="rounded-md"
            size={"icon"}
            variant={"outline"}
            onClick={() => setSelectedOption(null)}
          >
            <LucideArrowLeft className="h-6 w-6" />
          </Button>
          {selectedOption === "createPost" && <CreatePost />}
          {selectedOption === "createKlipz" && <CreateKlipz />}
          {selectedOption === "createFramez" && <CreateFramez />}
        </>
      )}
    </div>
  );
};

export default SelectPostType;
