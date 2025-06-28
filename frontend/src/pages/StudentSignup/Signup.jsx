import logo from "../../asset/logo.png"
import { ExternalLink } from "lucide-react"
import StudentSignupForm from "./Components/StudentSignupForm"

export const Signup = () => {
  return (
    <>
      <div className="flex w-full min-h-screen justify-center relative">
        <div className="signup-footer-logo h-20 w-full absolute bottom-0 -z-10"></div>

        <div className="w-[40%] signup-left flex-col items-center justify-center hidden sm:flex">
          <div>
            <h1 className="text-white scroll-m-20 text-3xl font-semibold tracking-tight lg:text-5xl ">
              Unlock <br />
              The <br />
              Global Campus
              <br /> Chatter
            </h1>
            <blockquote className="text-white mt-6 italic">
              Explore trends, events <br />
              from every corner of academia
            </blockquote>
          </div>
        </div>
        <div className="w-[90%] lg:w-[60%] flex items-center flex-col pb-5">
          <img src={logo} alt="" className="mt-10" />

          <StudentSignupForm />

          <div className="mt-5 italic text-gray-600 text-md ">

            <a
              href="https://kb-institution.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center justify-center"
            >
              <div>
                Are you an
                <span className="text-purple-500 font-semibold ml-1">institution</span>?
              </div>

              <div>
                Here is where you could
                <span className="text-purple-500 font-semibold ml-1">register</span>
                <ExternalLink className="inline ml-1" />
              </div>


            </a>
          </div>



        </div>
      </div>
    </>
  )
}
