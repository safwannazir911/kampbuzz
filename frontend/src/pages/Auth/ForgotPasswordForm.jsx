import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CrudServices } from "@/API/CrudServices";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import CommonCombinedInput from "@/components/common/CommonCombinedInput";

const FormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    otp: z
      .string()
      .length(4, { message: "Your one-time password must be 4 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "", // default value for email
      otp: "", // default value for OTP
      password: "", // default value for password
      confirmPassword: "", // default value for confirmPassword
    },
  });

  const navigate = useNavigate(); // Initialize the navigate function
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(true);

  const crudServices = new CrudServices();
  const signIn = useSignIn();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
        // Handle resetting password
        const response = await crudServices.forgotPassword(
          data.email,
          data.password,
          data.otp,
        );
        console.log(response);
        if (response.status === 200) {
          signIn({
            auth: {
              token: response.data.token,
              type: "Bearer",
            },
          });
          navigate("/feed");
        }
        else{
          toast.error(response.error);
        }
        
    } catch (error) {
      console.error("Error", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (email) => {
    setLoading(true);
    try {
      const response=await crudServices.sendOTP(email);
      if (response.status === 200) {
        toast.success("OTP resent successfully!");
        setShowEmail(false);
      }
      else{
        console.log(response)
        toast.error(response.error);
      }
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
        className="w-full md:w-2/3 space-y-6 p-4"
      >
        <div className={showEmail ? "block" : "hidden"}>
          <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Verify it's you.
          </h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="mt-2"
            onClick={() => handleSendOTP(form.getValues("email"))}
            disabled={loading}
          >
            Send OTP
          </Button>
        </div>
  
        <div className={showEmail ? "hidden" : "block"}>
          <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Set your new Password.
          </h2>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="otp">One-Time Password</FormLabel>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">New Password</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    id="password"
                    placeholder="Enter your new password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <FormControl>
                  <CommonCombinedInput
                    {...field}
                    id="confirmPassword"
                    placeholder="Confirm password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="submit" disabled={loading} className="mt-2"
            >
              Reset Password
            </Button>
            <Button
              type="button"
              className="mt-2"
              onClick={() => handleSendOTP(form.getValues("email"))}
              disabled={loading}
            >
              Resend OTP
            </Button>
          </div>
        </div>
      </form>
    </Form>
  </div>
  
  );
}
