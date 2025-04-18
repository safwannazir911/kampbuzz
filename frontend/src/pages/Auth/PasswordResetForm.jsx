import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CommonCombinedInput from "@/components/common/CommonCombinedInput";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { CrudServices } from "@/API/CrudServices";
import useSignOut from "react-auth-kit/hooks/useSignOut";

const FormSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  newPassword: z
    .string()
    .min(8, { message: "New password must be at least 8 characters." }),
});

export default function PasswordResetForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const navigate = useNavigate();
  const authUser = useAuthUser();
  const signOut = useSignOut();

  const crudServices = new CrudServices();

  const onSubmit = async (data) => {
    try {
      console.log(authUser);
      const response = await crudServices.resetPassword(
        authUser.email,
        data.currentPassword,
        data.newPassword,
      );
      console.log("Response", response);
      if (response.error) {
        toast.error(response.error);
      }
      if (response.data.userId) {
        toast.success(response.data.message);
        signOut();
        navigate(`/verify/${response.data.userId}`);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen container">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Reset Your Password
          </h2>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    placeholder="Enter your current password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    placeholder="Enter your new password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-start">
            <Button type="submit">Reset Password</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
