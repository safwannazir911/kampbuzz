import React, { useState, useEffect } from "react";
import { UserNav } from "@/components/user-nav";
import UserControlMessages from "./UserControlMessages";
import UserControlNotifications from "./UserControlNotifications";
import { CrudServices } from "@/API/CrudServices";

const FeedUserControl = () => {
  const [inData, setData] = useState(null);
  const crudServices = new CrudServices();

  const getStudentDetails = async () => {
    try {
      await crudServices
        .getStudentDetails()
        .then((response) => {
          if (response.data) {
            // console.log("Feed", response.data.studentData)
            setData(response.data.studentData);
          }
        })
        .catch((error) => {
          console.log("Error", error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  return (
    <div className="flex h-fit items-center sm:justify-evenly justify-end bg-white ">
      {/* <div className="sm:flex hidden grow  justify-center items-center"></div> */}
      <div className="flex flex-row  justify-evenly items-center">
        {/* <div className="ml-2 flex items-center">
          <UserControlMessages />
        </div>
        <div className="ml-2 flex items-center">
          <UserControlNotifications />
        </div> */}
        <div className="ml-2 flex items-center">
          {inData && <UserNav data={inData} />}
        </div>
      </div>
    </div>
  );
};

export default FeedUserControl;
