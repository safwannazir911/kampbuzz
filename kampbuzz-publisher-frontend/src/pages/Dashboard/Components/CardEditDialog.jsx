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
import { Textarea } from "@/components/ui/textarea";

// Define form schema for adding comments
const addCommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

export function CardEditDialog({ data, comments }) {
  // Default values for the form
  const defaultValues = {
    comment: "", // Empty string for new comment input
  };

  // useForm hook to manage form state
  const form = useForm({
    resolver: zodResolver(addCommentSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log(data); // You can handle the submission logic here
    form.reset(); // Reset the form after submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          role="menuitem"
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-black-500"
          tabIndex="-1"
          data-orientation="vertical"
          data-radix-collection-item=""
        >
          Add Comments
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comments</DialogTitle>
          <DialogDescription>
            Request changes from the author.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel>Comments</FormLabel>
              <div className="border rounded p-3 mb-4 bg-gray-100 max-h-40 overflow-auto">
                {comments?.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="mb-2">
                      <strong>{comment.author}:</strong> {comment.text}
                    </div>
                  ))
                ) : (
                  <p>No previous comments</p>
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add your comment here..."
                      {...field}
                      rows="4"
                      className="resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Request Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
