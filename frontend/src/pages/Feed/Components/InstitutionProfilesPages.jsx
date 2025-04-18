import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InstitutionProfilePosts from "./InstitutionProfilePosts";
import InstitutionProfileAbout from "./InstitutionProfileAbout";

const Profile = ({ data }) => {
  // console.log("Profile data", data);
  const pages = [
    <InstitutionProfilePosts data={data?.posts || ""} />,
    
    //TODO: Later need to implement the Institution Bio or description
    <InstitutionProfileAbout data={data?.address || ""} />,
  ];
  const [activePageIndex, setActivePageIndex] = useState(0);

  const activeStyle = {
    background: "rgb(139, 92, 246)",
    color: "white",
  };

  return (
    <>
      <div
        className="w-[90%] h-[50vh] bg-[#f7f7f7] rounded-md relative"
        style={{
          backgroundImage: `url(${data?.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="md:w-[80%] w-full h-[40vh] bg-[#fff] rounded-md absolute bottom-[-30%] md:left-[10%] left-0 shadow-md">
          <div className="w-full h-full flex flex-col justify-center items-center p-5 ">
            <div className="flex items-center">
              <Avatar className="bg-white mr-5 w-20 h-20">
                <AvatarImage src={data?.avatar} alt={data?.name} />
                <AvatarFallback>
                  {data?.name.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="w-[60%]">
                <div className="w-auto   mb-1 font-bold sm:text-[18px] text-[14px]">
                  {data.name}
                </div>
                <div className=" w-auto   mb-1 text-[12px]">
                  {data.email || "@university_handle"}
                </div>
                <div className="w-auto text-[14px]">
                  {data?.address || "A Short Description of university"}
                </div>
              </div>
            </div>
            <div className="w-full h-[15vh] flex items-end justify-between">
              <div className="w-full flex justify-around text-center">
                <div className="flex flex-col justify-center items-center">
                  <TrendingUp />
                  <span className="block ">Trending in J&K</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="block text-lg font-bold sm:text-[32px] text-[24px]">
                    {data?.totalPosts}
                  </span>
                  <span className="block text-gray-600">Posts</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="block text-lg font-bold sm:text-[32px] text-[24px]">
                    {data.followers}
                  </span>
                  <span className="block text-gray-600 ">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] mt-[20vh] flex justify-center items-center ">
        <Badge
          variant={"outline"}
          style={activePageIndex == 0 ? activeStyle : { background: "inherit" }}
          className={`text-base hover:bg-indigo-300 border-none pl-8 pt-3 pr-8 pb-3 rounded-md mr-5 cursor-pointer `}
          onClick={() => setActivePageIndex(0)}
        >
          All Posts
        </Badge>
        <Badge
          variant={"outline"}
          style={activePageIndex == 1 ? activeStyle : { background: "inherit" }}
          className={`text-base hover:bg-indigo-300 border-none pl-8 pt-3 pr-8 pb-3 rounded-md mr-5 cursor-pointer `}
          onClick={() => setActivePageIndex(1)}
        >
          About
        </Badge>
      </div>
      <div className="w-[90%]">
        {activePageIndex === 0 ? pages[0] : pages[1]}
      </div>
    </>
  );
};

export default Profile;
