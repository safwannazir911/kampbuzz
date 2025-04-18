import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import TeamMember from "./TeamMember";
import TeamAdd from "./TeamAdd";
import { CrudServices } from "../../../../Api/CrudServices";

const Team = () => {
  const crudServices = new CrudServices(); // Create instance of the crud services
  const [authors, setAuthors] = useState([]); // State for storing authors list
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await crudServices.FetchDetails();
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Fetched Successfully");
        setAuthors(response.data.publisher.institutionAuthors);
      }
    } catch (err) {
      toast.error("Error Fetching Authors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (id) => {
    console.log(id);
    alert("View Profile Clicked");
  };

  const handleDelete = (id) => {
    console.log(id);
    alert("Delete Clicked");
  };

  const refreshAuthorList = () => {
    fetchAuthors();
  };

  const renderAuthors = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-lg text-gray-500">Loading Authors...</p>
        </div>
      );
    }

    if (authors.length === 0) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-lg text-gray-500">No Authors Available</p>
        </div>
      );
    }

    return authors.map((author, index) => (
      <TeamMember
        key={index}
        id={author._id}
        name={author.institutionAuthor}
        email={author.authorEmail}
        onViewProfile={handleViewProfile}
        onDelete={handleDelete}
      />
    ));
  };

  return (
    <div className="">
      <div className="text-4xl font-bold">Team</div>
      <div className="">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList className="mt-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
              <TabsTrigger value="add-author">Add Author</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all">
            <div className="flex flex-wrap">{renderAuthors()}</div>
          </TabsContent>
          <TabsContent value="group">
            <div className="flex justify-center items-center w-full h-full">
              <p className="text-lg text-gray-500">Currently No Groups there.</p>
            </div>
          </TabsContent>
          <TabsContent value="add-author">
            <div className="flex justify-center">
              <TeamAdd onRefresh={refreshAuthorList} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Team;
