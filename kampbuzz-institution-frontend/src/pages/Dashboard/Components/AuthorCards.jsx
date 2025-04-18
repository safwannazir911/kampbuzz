import { useState, useEffect, useCallback } from "react";
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

export const AuthorCards = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const crudServices = new CrudServices();

  // Define fetchInstitutionDetails as a useCallback
  const fetchInstitutionDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await crudServices.getInstitutionDetails();
      if (response.error) {
        toast.error(response.error);
      } else {
        setAuthors(response.data.institution.institutionAuthor);
      }
    } catch (err) {
      toast.error("Error fetching Institution details", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchInstitutionDetails();
  }, [fetchInstitutionDetails]);

  return (
    <>
      {loading ? (
        <Card className="w-[90%] m-auto">
          <CardHeader>
            <CardTitle>Loading Authors</CardTitle>
            <CardDescription>Authors will appear here!</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ScrollArea className="h-[70vh] w-full">
          {authors.map((author) => (
            <EntityCard
              key={author._id}
              name={author.institutionAuthor}
              email={author.authorEmail}
            />
          ))}
        </ScrollArea>
      )}
    </>
  );
};
