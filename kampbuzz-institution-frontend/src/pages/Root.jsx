import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Login from "./Login";
import Signup from "./Signup";
import { UserPlus, LogIn } from "lucide-react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import dashLogBg from "@/assets/dashLogBg.png";
import GoogleLogo from "@/assets/GoogleLogo.png";

const Root = () => {
  const authUser = useAuthUser();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/home");
    }
  }, [authUser, navigate]);


  return (
    <>
      <Header />
      <div
        style={{ backgroundImage: `url(${dashLogBg})` }}
        className="bg-cover bg-right bg-no-repeat w-full flex md:flex-row flex-col h-screen items-center md:items-start md:justify-around bg-purple-50"
      >
        <div className="md:w-[50%] flex md:min-h-[100%] justify-center items-start md:pt-[5em] md:p-2 p-10">
          <div className="flex flex-col items-start">
            <p className="md:text-3xl text-xl font-bold">Get To</p>
            <p className="md:text-5xl text-3xl font-bold">Your Dashboard</p>
            <p className="md:text-xl  text-[14px] font-light">
              Time to work your magic and keep things in check on the dashboard.
            </p>
          </div>
        </div>
        <div className="md:w-[50%] flex flex-col md:min-h-[100%] justify-center items-center">
          {isLogin ? <Login /> : <Signup />}

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {isLogin ? (
                <>
                  <UserPlus className="mr-2" />
                  Go to Signup
                </>
              ) : (
                <>
                  <LogIn className="mr-2" />
                  Go to Login
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </>
  );
};

export default Root;
