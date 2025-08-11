import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { InstitutionProfileSkelton } from "@/components/Loaders";
import Profile from "./InstitutionProfilesPages";
import NotFound from "@/components/NotFound";
import { FeedService } from "@/API/FeedService";

// -H
// To implement institutionProfile click from anywhere on the application
import useNavigation from "@/feature/NavigationContext";

const InstitutionProfile = ({ onBack, id }) => {
  const { institutionID } = useNavigation(); // to get the institution id from the navigation context state
  const [isLoading, setLoading] = useState(true);
  const [institutionData, setInstitutionData] = useState(null);
  const crudServices = new FeedService();

  const fetchInstitutionData = async () => {
    try {
      const response = await crudServices.GetInstitute(institutionID);
      setInstitutionData(response.data.institution);
    } catch (error) {
      console.error("Error fetching institution data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutionData();
  }, [institutionID]); // added institutionID as dependency for whenever the ID changes the profile is fetched

  return (
    <div>
      <div
        className="h-14 flex items-center font-bold cursor-pointer"
        onClick={onBack}
      >
        <ArrowLeftIcon className="h-full w-8" />
        <p>Back To Page</p>
      </div>
      <div className="flex flex-col  items-center">
        {isLoading ? (
          <InstitutionProfileSkelton />
        ) : !isLoading && institutionData ? (
          <Profile data={institutionData} />
        ) : (
          <NotFound message={"Ohh! Seems like a dead-end"} />
        )}
      </div>
    </div>
  );
};

export default InstitutionProfile;
