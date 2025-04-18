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
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Schema for login
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const defaultLoginValues = {
    email: "",
    password: "",
  };

  const crudServices = new CrudServices();
  const [loading, setLoading] = useState(false);
  const signIn = useSignIn();
  const navigate = useNavigate();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
  });

  const handleLoginSubmit = async (values) => {
    setLoading(true);
    try {
      await crudServices.loginUser(values).then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          console.log(response.data);
          toast.success("Login Successful");
          signIn({
            auth: {
              token: response.data.token,
              type: "Bearer",
            },
            userState: {
              name: response.data.institution.name,
              phone: response.data.institution.phone,
              email: response.data.institution.email,
              address: response.data.institution.address,
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

  return (
    <div className="md:w-[70%] xl:w-[60%] 2xl:w-[50%] bg-white p-5 rounded-[10px]">
      <h1 className="sm:text-4xl text-2xl font-bold">Login</h1>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
          className="w-full flex flex-col gap-4 p-4"
        >
          <FormField
            control={loginForm.control}
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
            control={loginForm.control}
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
                {/* <div className="flex items-center justify-between">
                  <div>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="mr-2 my-2"
                    />
                    <FormLabel htmlFor="rememberMe">Remember me</FormLabel>
                  </div>

                  <a href="#" className="sm:text-sm text-[10px] hover:underline ml-40">
                    Forgot Password?
                  </a>
                </div> */}
              </FormItem>
            )}
          />
          <div className="mb-1 flex justify-end ">
            <Button
              disabled={loading}
              type="submit"
              className="px-10 hover:underline bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            >
              Login
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
  );
};

export default Login;
