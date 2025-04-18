import searching from "../../../asset/searching.png"
import group from "../../../asset/group.png"
import { Monitor, TabletSmartphone } from "lucide-react" // Import the icons you need
import google from "../../../asset/google.png"
import app from "../../../asset/app.png"
import "../../../components/style.css"

export const About = () => {
  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight  text-center mt-5">
        What’s on
        <span className="custom-background"> kampbuzz</span>
      </h2>

      <div>
        <div className="flex sm:flex-row flex-col items-center justify-center m-5">
          <img src={searching} alt="" className="w-90 h-90 mr-4" />
          <div>
            <h4 className="text-2xl font-bold">See what’s happening around</h4>
            <p className="italic">
              On Kampbuzz, see what’s new around your campus and your friends
              too...
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex sm:flex-row flex-col-reverse items-center justify-center m-5">
          <div>
            <h4 className="text-2xl font-bold">Active Student Community</h4>
            <p className="italic">
              It’s the students, who love writing, bring you the new buzz.
            </p>
          </div>
          <img src={group} alt="" className="w-90 h-90 ml-4" />
        </div>
      </div>

      <div className="flex justify-center items-center flex-col m-5">
        <div className="flex flex-row gap-x-0.5">
          <Monitor />
          <TabletSmartphone />
        </div>

        <p className="text-xl text-muted-foreground mb-2">Buzz on any screen</p>

        <div className="flex flex-row gap-x-0.5">
          <img src={google} alt="" className="w-20" />
          <img src={app} alt="" className="w-20" />
        </div>
      </div>
    </>
  )
}
