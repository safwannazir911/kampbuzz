// contains user personel feed
import React from "react"; // basic react imports
import Stories from "./Stories"; // imports stories section  containing stories
import Posts from "../Common/Posts"; // import Posts section containing posts

const UserPage = () => {
  return (
    <div className="w-full">
      <Stories />
      <Posts />
    </div>
  );
};

export default UserPage;
