import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CrudServices } from "@/API/CrudServices";
import useSignIn from "react-auth-kit/hooks/useSignIn";

const FormSchema = z.object({
  otp: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});

export default function InputOTPForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate function
  const [loading, setLoading] = useState(false);
  const crudServices = new CrudServices();
  const signIn = useSignIn();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await crudServices.verifyOTP(id, data.otp);
      console.log(response);
      if (response.status===200) {
        signIn({
          auth: {
            token: response.data.token,
            type: "Bearer",
          }
        });
        navigate("/feed");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await crudServices.resendOTP(id);
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error("Error while resending OTP", error);
      toast.error("Failed to resend OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Verify your email.
          </h2>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={4} {...field}>
                    <InputOTPGroup>
                      {[...Array(4)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the 4-digit one-time password sent to your email.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="button" onClick={handleResendOTP} disabled={loading}>
              Resend OTP
            </Button>
            <Button type="submit" disabled={loading}>
              Verify
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
