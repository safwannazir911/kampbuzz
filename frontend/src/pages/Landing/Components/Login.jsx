import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GoogleLogo from "../../../asset/GoogleLogo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CommonCombinedInput from "@/components/common/CommonCombinedInput";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/Loaders";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { defaultLoginValues } from "@/constants/defaultCreds";
import { CrudServices } from "@/API/CrudServices";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const Login = () => {
  const navigate = useNavigate();
  const authUser = useAuthUser();
  const signIn = useSignIn();
  const crudServices = new CrudServices();
  const [isLoading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultLoginValues,
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await crudServices.loginUser(values).then((response) => {
        console.log(response)
        if (response.error) {
          toast.error(response.error);
        } else {
          console.log(response.data);
          toast.success("Login Successfull");
          if (response.data.token) {
            signIn({
              auth: {
                token: response.data.token,
                type: "Bearer",
              },
              userState: {
                id: response.data.user._id,
                name: response.data.user.institutionAuthor,
                email: response.data.user.email,
                username: response.data.user.username,
                phone: response.data.user.phone,
                gender: response.data.user.gender,
              },
            });
            navigate("/feed");
          }
        }

        if (response.data.userId) {
          navigate(`/verify/${response.data.userId}`);
        }
      });
    } catch (error) {
      console.log(error)
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      navigate("/feed");
    }
  }, [authUser, navigate]);

  return (
    <>
      {isLoading && <PageLoader />}
      <div className="flex justify-around items-center sm:mt-20 mt-7">
        <h1 className="sm:text-4xl text-2xl font-bold ">Login</h1>
        <h6 className="ml-1 sm:text-sm text-[10px]">
          {`Don't have an account?/`}{" "}
          <Link to="/signup" className="hover:underline">
            <b>Sign up</b>
          </Link>
        </h6>
      </div>

      <div className="flex justify-center sm:h-screen  lg:mt-20 mt-2 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="sm:max-w-md w-full flex flex-col gap-4 p-4"
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
                      value={field.value}
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
                      placeholder="Password"
                      type="password"
                    />
                  </FormControl>
               <div className="flex justify-end">
                    {/* <input
                      type="checkbox"
                      id="rememberMe"
                      className="mr-2 my-2"
                    />
                    <FormLabel htmlFor="rememberMe">Remember me</FormLabel> */}
                    <Link
                      to="/forgot-password"
                      className="sm:text-sm text-[10px] hover:underline ml-40"
                    >
                      Forgot Password?
                    </Link>

                  </div> 
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mb-1 flex justify-end ">
              <Button
                type="submit"
                className="px-10 hover:underline bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              >
                Login
              </Button>
            </div>

    
            {/* <div className="flex items-center">
              <span className="w-[200px] h-[3px] bg-white inline border rounded-[10px]">
                {" "}
              </span>
              <span className="mb-1  p-2 text-black font-bold ">or</span>
              <span className="w-[200px] h-[3px] bg-white inline border rounded-[10px]">
                {" "}
              </span>
            </div> */}

            <div className="flex justify-center  items-center ">
              {/* <i className="fab fa-google mr-2 bg-white p-3 rounded"></i> */}
              {/* <img
                src={GoogleLogo}
                className="w-[36px] bg-white rounded-[100%]"
              /> */}
              {/* <p className="hidden sm:block">Sign in with Google</p> */}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Login;
