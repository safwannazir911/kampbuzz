import React from "react"
import { BadgeInfo } from "lucide-react"

const NotFound = ({ message }) => {
  return (
    <div className="w-[90%] h-[90vh] flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <BadgeInfo />
        <p>{message}</p>
      </div>
    </div>
  )
}

export default NotFound
