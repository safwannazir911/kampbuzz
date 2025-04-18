import React, { useState } from "react"
import { Home, Search, Telescope, Play } from "lucide-react"
import logo from "../../../asset/logo.png"

// dummy data
const items = [
  { title: "Home", status: 1, svg: <Home /> },
  { title: "Search", status: 0, svg: <Search /> },
  { title: "Discover", status: 0, svg: <Telescope /> },
  { title: "Klipz", status: 0, svg: <Play /> },
]

// Menu item component for every menu item
const Item = ({ title, svg, onClick, status }) => {
  // changes style when active or clicked with some small transition effect
  const itemStyle = {
    backgroundColor: status === 1 ? "white" : "inherit",
    // @Tabeed-H
    // added property color on menu so that unactive options are white while the selected option is in black color "Inherited color"
    color: status === 1 ? "inherit" : "white",
    transition: "color 0.3s, background-color 0.3s",
  }

  return (
    <div
      style={itemStyle}
      className="rounded-xl p-4 mx-2 my-3 flex flex-row items-center md:justify-normal justify-center text-lg cursor-pointer menu_styles"
      onClick={onClick}
    >
      <div className="sm:mr-2">{svg}</div>
      <div className="md:block hidden">{title}</div>
    </div>

  )
}

const FeedMenu = ({ changePage }) => {
  //  if pages are rendered dynamically (though not practical) this approach can be used and easy used when calling a API
  const [menuItems, setMenuItems] = useState(items)

  //   for menu change
  const handleItemClick = (e, index) => {
    e.preventDefault()
    // inverts the value where the index matches else all zero
    const updatedItems = menuItems.map((item, i) => ({
      ...item,
      status: i === index ? 1 : 0,
    }))
    setMenuItems(updatedItems)
    changePage(index, menuItems[index].title) // changes page
  }
  

  return (
    <div className="pt-6 sticky lg:min-w-[14vw] max-w-[18vw] bg-[#B794FA] flex flex-col items-center justify-start">
      <div className="mt-5" >
        <img src={logo} alt="" className="w-[3rem] sm:w-[4rem] md:w-[3rem] lg:w-[4rem]" />
      </div>
      <div className="w-full mt-4 sm:mt-12">
        {menuItems.map((item, index) => (
          <Item
            key={index}
            title={item.title}
            status={item.status}
            svg={item.svg}
            onClick={(e) => handleItemClick(e, index)}
          />
        ))}
      </div>

    </div>
  )
}

export default FeedMenu
