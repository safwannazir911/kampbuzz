import React from "react"
import ReelCard from "./ReelCard"

const ReelList = ({ videos }) => {
  // console.log("Videos",videos)
  return (
    <div>
      {videos.map((video) => (
        <ReelCard key={video._id} video={video} />
      ))}
    </div>
  )
}

export default ReelList
