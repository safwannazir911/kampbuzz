import React from "react"
import { Button } from "@/components/ui/button"
import typewriter from "../asset/typewriter.png"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

const TradeMark = () => {
  return (
    <div className="flex flex-row justify-between items-center bg-[#2F2F2F]">
      <div className="flex sm:flex-row flex-col sm:justify-evenly justify-center sm:items-center items-start text-white text-[14px] ml-3 p-[1em]">
        <div className="sm:ml-5 cursor-pointer">
          <a href="#">About</a>
        </div>
        <div className="sm:ml-5 cursor-pointer">
          <a href="#">Team</a>
        </div>
        <div className="sm:ml-5 cursor-pointer">
          <a href="#">Contact</a>
        </div>
        <div className="sm:ml-5 cursor-pointer">
          <a href="#">Dasboard</a>
        </div>
      </div>
      <div className="text-white mr-3 text-[12px]">Copyright kampbuzz 2024</div>
    </div>
  )
}

const Footer = () => {
  return (
    <>
      <div className="w-full bg-[#B794FA] p-[3em] flex flex-row sm:flex-row justify-around items-center">
        <div className=" h-full w-2/3 flex flex-col justify-center items-start ml-[3em]">
          <div className="sm:text-3xl text-2xl font-bold text-[#1F1F1F]">
            Love Writing?
          </div>
          <div className="text-[#0B0B0B] sm:text-xl text-[14px] snot-italic font-light leading-[normal] mt-3">
            Love writing? Want to write what’s happening on your campus and want
            others to know. Become a writer for kampbuzz.
          </div>
          <Button
            variant="outline"
            className="mt-3 inline-flex justify-center items-center bg-white text-black font-bold shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[2em] rounded-[10px] hover:bg-gray-100"
          >
            Become a Reporter
          </Button>
        </div>
        <div className="h-auto  w-[60%] sm:flex justify-end hidden">
          <img
            src={typewriter}
            alt="Type Writer"
            className="max-w-[60%] h-auto"
          />
        </div>
      </div>
      <TradeMark />
    </>
  )
}

export default Footer
