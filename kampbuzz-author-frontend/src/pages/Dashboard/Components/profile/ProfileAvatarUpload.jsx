import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as z from "zod";
import { CrudServices } from "../../../../../Api/CrudServices";
import { Skeleton } from "@/components/ui/skeleton";

const authorProfileAvatarUploadSchema = z.object({
  files: z.instanceof(File, { message: "Please upload a valid file" }),
});

const ProfileAvatarUpload = () => {
  const crudServices = new CrudServices();

  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState();
  const [uploading, setUploading] = useState(false);
  const [, setFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(authorProfileAvatarUploadSchema),
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await crudServices.FetchDetails();
      // console.log(response.data.author);
      if (response.data) {
        setAuthor(response?.data?.author);
      } else {
        toast.error("Failed to fetch user profile. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (data) => {
    const formData = new FormData();
    if (data.files) {
      formData.append("files", data.files);
    }
    setUploading(true);
    try {
      const res = await crudServices.uploadAuthorAvatar(formData);
      // console.log("Avatar upload response", res);
      if (res) {
        toast.success("Avatar updated successfully");
        fetchUserProfile();
      } else {
        toast.error("Failed to update avatar. Please try again.");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="grid gap-2 mt-2">
          {loading ? (
            <div className="flex justify-center items-center">
              <Skeleton className="h-[200px] w-[200px] rounded-full bg-slate-400" />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <img
                alt={author?.name || "User Profile Image"}
                className="aspect-square rounded-full object-cover"
                src={author?.avatar || "https://via.placeholder.com/200"}
                height={200}
                width={200}
              />
            </div>
          )}
          <div className="flex justify-center items-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)} className="flex gap-3">
                <FormField
                  name="files"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setFile(file);
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-1 text-white bg-gradient-to-tr from-purple-600 to-orange-600 hover:from-purple-800 hover:to-orange-800"
                  type="submit"
                  disabled={uploading}
                  variant={"secondary"}
                >
                  {uploading ? "Uploading..." : "Upload Avatar"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAvatarUpload;
