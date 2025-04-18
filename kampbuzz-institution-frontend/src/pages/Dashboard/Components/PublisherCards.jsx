import { useState, useEffect } from "react";
import EntityCard from "./EntityCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CrudServices } from "../../../../Api/CrudServices";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const PublisherCards = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const crudServices = new CrudServices();
  const fetchInstitutionDetails = async () => {
    setLoading(true);
    try {
      const response = await crudServices.getInstitutionDetails();
      if (response.error) {
        toast.error(response.error);
      } else {
        setPublishers(response.data.institution.institutionPublisher);
      }
    } catch (err) {
      toast.error("Error fetching Institution details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {!loading ? (
        <ScrollArea className="h-[70vh] w-[100%]">
          {publishers.map((publisher) => (
            <EntityCard
              key={publisher._id}
              name={publisher.name}
              email={publisher.email}
            />
          ))}
        </ScrollArea>
      ) : (
        <Card className="w-[90%] m-auto">
          <CardHeader>
            <CardTitle>No publishers yet</CardTitle>
            <CardDescription>Publishers will appear here!</CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  );
};
