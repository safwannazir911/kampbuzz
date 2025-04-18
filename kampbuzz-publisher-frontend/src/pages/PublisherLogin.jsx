import { Header } from "@/components/Header";
import dashLogBg from "@/assets/dashLogBg.png";
import GoogleLogo from "@/assets/GoogleLogo.png";
import Login from "./Login";

const PublisherLogin = () => {

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
            <p className="md:text-xl text-[14px] font-light">
              Time to work your magic and keep things in check on the dashboard.
            </p>
          </div>
        </div>
        <div className="md:w-[50%] flex md:min-h-[100%] justify-center items-center">
          <Login />
        </div>
      </div>
    </>
  );
};

export default PublisherLogin;
