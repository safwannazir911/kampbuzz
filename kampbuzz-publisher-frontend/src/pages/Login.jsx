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
import { useEffect, useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    const defaultValues = {
        email: "",
        password: "",
    };
    const crudServices = new CrudServices();
    const [loding, setLoading] = useState(false);
    const signIn = useSignIn();
    const authUser = useAuthUser();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues,
    });

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            await crudServices.loginUser(values).then((response) => {
                if (response.error) {
                    toast.error(response.error);
                } else {
                    console.log(response.data);
                    toast.success("Login Successfull");
                    signIn({
                        auth: {
                            token: response.data.token,
                            type: "Bearer",
                        },
                        userState: {
                            id: response.data.user._id,
                            name: response.data.user.institutionAuthor,
                            email: response.data.user.authorEmail,
                        },
                    });
                    navigate("/home");
                }
            });
        } catch (error) {
            toast.error("Login Failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authUser) {
            navigate("/home");
        }
    }, [authUser, navigate]);
    return (
        <div className="md:w-[70%] xl:w-[60%] 2xl:w-[50%] bg-white p-5 rounded-[10px]">
            <h1 className="sm:text-4xl text-2xl font-bold ">Login</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-4 p-4"
                >
                    <FormField
                        control={form.control}
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
                        control={form.control}
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
                            </FormItem>
                        )}
                    />
                    <div className="mb-1 flex justify-end ">
                        <Button
                            disabled={loding}
                            type="submit"
                            className="px-10 hover:underline bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        >
                            Login
                        </Button>
                    </div>
                    <div className="flex justify-center  items-center ">
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Login;