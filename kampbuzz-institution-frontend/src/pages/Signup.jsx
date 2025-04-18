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
import CommonCombinedInput from "@/components/common/CommonCombinedInput";
import { toast } from "sonner";
import { CrudServices } from "../../Api/CrudServices";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const Signup = () => {
    // Schema for signup
    const signupSchema = z.object({
        name: z.string().min(4, {
            message: "Name must have at least 4 characters."
        }).max(25, {
            message: "Name can have at most 25 characters."
        }).regex(/^[a-zA-Z ]+$/, {
            message: "Name should contain only alphabets."
        }),
        email: z.string().email().max(320, {
            message: "Email can have at most 320 characters."
        }),
        password: z.string().min(6, {
            message: "Password should have at least 6 characters.",
        }).max(25, {
            message: "Password can have at most 25 characters."
        }).regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,25}$/, {
            message: "At least 1 lower, upper & special character",
        }),
        confirmPassword: z.string(),
        phone: z.string().refine((value) => /^\d{10}$/.test(value), {
            message: "Phone number must be exactly 10 digits long and contain only digits",
        }),
        address: z.string().regex(/^[a-zA-Z0-9, ]+$/, {
            message: "Address should contain only letters, numbers, and commas."
        }).min(1, { message: "Address is required." })
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
    const defaultSignupValues = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    };

    const crudServices = new CrudServices();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    const signupForm = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: defaultSignupValues,
    });

    const handleSignupSubmit = async (values) => {
        setLoading(true);
        try {
            await crudServices.signupUser(values).then((response) => {
                if (response.error) {
                    toast.error(response.error);
                } else {
                    toast.success("Signup Successful");
                    navigate("/home");
                }
            });
        } catch (error) {
            toast.error("Signup Failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="md:w-[70%] xl:w-[60%] 2xl:w-[50%] bg-white p-5 rounded-[10px]">
            <h1 className="sm:text-4xl text-2xl font-bold">Signup</h1>
            <Form {...signupForm}>
                <form
                    onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
                    className="w-full flex flex-col gap-4 p-4"
                >
                    <FormField
                        control={signupForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Institution Name</FormLabel>
                                <FormControl>
                                    <CommonCombinedInput
                                        {...field}
                                        placeholder="Enter the name of your Institution"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <CommonCombinedInput
                                        {...field}
                                        placeholder="Enter your email address"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <CommonCombinedInput
                                        {...field}
                                        placeholder="Enter your password"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <CommonCombinedInput
                                        {...field}
                                        placeholder="Confirm your password"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signupForm.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <CommonCombinedInput
                                        {...field}
                                        placeholder="Enter your phone number"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signupForm.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <CommonCombinedInput
                                        {...field}
                                        placeholder="Enter your address"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="mb-1 flex justify-end">
                        <Button
                            disabled={loading}
                            type="submit"
                            className="px-10 hover:underline bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        >
                            Signup
                        </Button>
                    </div>
                    {/* <div className="flex items-center">
            <span className="w-[200px] h-[3px] bg-black inline border rounded-[10px]"> </span>
            <span className="mb-1  p-2 text-black font-bold ">or</span>
            <span className="w-[200px] h-[3px] bg-black inline border rounded-[10px]"> </span>
          </div>
          <div className="flex justify-center items-center">
            <img src={GoogleLogo} className="w-[36px] bg-white rounded-[100%]" />
          </div> */}
                </form>
            </Form>
        </div>
    )
};

export default Signup;