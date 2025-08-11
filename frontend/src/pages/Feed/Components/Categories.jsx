/**
 * The Categories component in JavaScript React renders a list of categories with capitalized first
 * letters and clickable badges.
 * @returns The `Categories` component is being returned. It maps over the `categories` array,
 * capitalizes the first letter of each category, and renders a `Badge` component for each category
 * with the capitalized name. Each `Badge` component has a click event handler that calls the
 * `changeCategory` function with the corresponding category when clicked. The entire list of
 * categories with styled badges is rendered inside a `
 */
import React from "react"
import { Badge } from "@/components/ui/badge"

function Categories({ categories, changeCategory, active }) {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  //   
  // implemented active category desing
  // the below design is implemented to the currernt active category
  const activeStyle = {
    background: "rgb(139, 92, 246)",
    color: "white",
  }

  return (
    <div
      className="mb-2 flex p-2 overflow-x-scroll overflow-y-hidden bg-white  z-50"
      style={{ scrollbarWidth: "none", zIndex: "99" }}
    >
      {categories.map((item, index) => (
        <span
          key={index}
          className="mr-2 cursor-pointer z-50"
          onClick={() => changeCategory(item, index)}
        >
          <Badge
            variant="outline"
            style={index == active ? activeStyle : { background: "inherit" }} // checks if the current items is the active item or not
            className="text-base bg-violet-500 hover:bg-indigo-300 border-none  px-4 py-1 sm:px-8 sm:py-3 text-[#858585] rounded-md z-50"
          >
            {capitalizeFirstLetter(item)}
          </Badge>
        </span>
      ))}
    </div>
  )
}

export default Categories
