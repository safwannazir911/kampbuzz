import React from "react"
import HeroPNG from "../../../asset/HeroPNG.png"
import background from "../../../asset/background.png"
import Login from "./Login"

const Hero = () => {
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="w-full bg-cover bg-center lg:h-screen min-h-screen flex flex-col lg:flex-row lg:p-0 p-1"
    >
      <div className="lg:w-[60%] flex flex-col items-center lg:items-normal">
        <div className=" flex lg:justify-end justify-center  lg:w-[100%] lg:h-[70%] w-[40%]">
          <img src={HeroPNG} className="mr-[2em]" />
        </div>
        <div className="flex lg:justify-center justify-center lg:text-6xl text-4xl font-bold text-[#303030] tracking-wide lg:ml-[-1em] lg:mt-[-2.5em]">
          <p>
            The <br />
            Global Campus
            <br /> Chatter
          </p>
        </div>
      </div>
      <div className="lg:w-[40%] h-[100%]">
        <Login />
      </div>
    </div>
  )
}

export default Hero
