import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CommonCombinedInput from "@/components/common/CommonCombinedInput";
import { CrudServices } from "../../../../Api/CrudServices";
import { toast } from "sonner";
import { User } from "lucide-react";

/**
 * Componet copied from @safwannazir911
 * From Institution
 */
const authorSchema = z.object({
  institutionAuthor: z
    .string()
    .min(4, {
      message: "Name must have at least 4 characters.",
    })
    .max(25, {
      message: "Name can have at most 25 characters.",
    })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Name should contain only alphabets.",
    }),
  authorEmail: z.string().email().max(320, {
    message: "Email can have at most 320 characters.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password should have at least 6 characters.",
    })
    .max(25, {
      message: "Password can have at most 25 characters.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,25}$/, {
      message: "At least 1 lower, upper & special character",
    }),
});

const defaultAuthorValues = {
  institutionAuthor: "",
  authorEmail: "",
  password: "",
};

const TeamAdd = ({ onRefresh }) => {
  const crudServices = new CrudServices();

  const authorForm = useForm({
    resolver: zodResolver(authorSchema),
    defaultValues: defaultAuthorValues,
  });

  const onSubmitAuthor = async (data) => {
    try {
      const response = await crudServices.CreateAuthor(data);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Author created Successfully!");
        onRefresh();
        authorForm.reset();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error creating author", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Author</CardTitle>
        <CardDescription>
          Fill in the details to create a new author.
        </CardDescription>
      </CardHeader>
      <Form {...authorForm}>
        <form
          onSubmit={authorForm.handleSubmit(onSubmitAuthor)}
          className="w-full flex flex-col gap-4 p-4"
        >
          <FormField
            control={authorForm.control}
            name="institutionAuthor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    placeholder="Enter your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={authorForm.control}
            name="authorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={authorForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="flex justify-end px-0">
            <Button type="submit">Save changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default TeamAdd;
