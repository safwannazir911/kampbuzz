import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ReactSelect from "react-select";
import CommonCombinedInput from "@/components/common/CommonCombinedInput";
import { interests } from "@/lib/data";
import { toast } from "sonner";
import { CrudServices } from "../../../../../Api/CrudServices";

const editPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()),
});

export function CardEditDialog({ post, onRefresh }) {
  // console.log("Card Edit Dialog",post);
  const [loading, setLoading] = React.useState(false);
  const crudServices = new CrudServices();

  const handleEdit = async (data) => {
    setLoading(true);
    try {
      const response = await crudServices.UpdatePost(post._id, data);
      if (response.error) throw new Error("Something Went Wrong!");
      toast.success("Post Updated successfully");
      onRefresh();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = {
    title: post?.title || "",
    content: post?.content || "",
    tags: [...post?.tags] || [],
  };

  const form = useForm({
    resolver: zodResolver(editPostSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    const updatedPost = {
      title: data?.title,
      content: data?.content,
      tags: data?.tags,
    };
    handleEdit(updatedPost);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          role="menuitem"
          className="relative flex cursor-pointer hover:bg-gray-200 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 "
          tabIndex="-1"
          data-orientation="vertical"
          data-radix-collection-item=""
        >
          Edit Post
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <CommonCombinedInput
                        rows="3"
                        placeholder="New title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <CommonCombinedInput
                        rows="5"
                        placeholder="New Content"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isMulti
                        options={interests}
                        placeholder="Select your interests"
                        defaultValue={defaultValues.tags.map((tag) => ({
                          value: tag,
                          label: tag,
                        }))}
                        onChange={(selectedOptions) => {
                          field.onChange(
                            selectedOptions.map((item) => item.value)
                          );
                        }}
                        styles={{
                          placeholder: (provided) => ({
                            ...provided,
                            color: "black",
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            color: "black",
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "#ddd1f9",
                            borderRadius: "20px",
                          }),
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
