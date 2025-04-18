import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CrudServices } from "../../../../../Api/CrudServices";
import { z } from "zod";
import CommonCombinedInput from "@/components/common/CommonCombinedInput";
import ProfileAvatarUpload from "./ProfileAvatarUpload";

const publisherProfileUpdateSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, { message: "Name should be min of 3 characters" })
    .optional(),
});

export default function ProfileUpdate() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialData, setInitialData] = useState();

  const crudServices = new CrudServices();

  const form = useForm({
    resolver: zodResolver(publisherProfileUpdateSchema),
    defaultValues: initialData ?? {},
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await crudServices.FetchDetails();
        // console.log("Profile update response", response.data.publisher);
        if (response.data) {
          setInitialData(response.data.publisher);
          form.reset(response.data.publisher);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const onSubmit = async (values) => {
    setUploading(true);
    try {
      const response = await crudServices.updatePublisher(values);
      // console.log("Profile update response", response.data);
      if (response.data) {
        setInitialData(response.data.publisher);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Card className="container mt-4 p-5 xl:w-[500px] sm:max-w-full">
      <CardContent>
        <div className="grid gap-2 mt-2">
          <ProfileAvatarUpload />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <CommonCombinedInput
                        {...field}
                        type="text"
                        placeholder="Update your name"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={uploading}
                className="w-full bg-purple-600 hover:bg-purple-800"
                type="submit"
              >
                {uploading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
