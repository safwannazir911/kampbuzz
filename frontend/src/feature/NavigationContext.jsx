/**
 * @Tabeed-H
 * Log: To implement Instituion Profile page and its subsidary functions and behavior.
 * See: React Context
 *
 * NavigationContext
 * React Context to be used for managing navigation state within the application.
 * Allows components to navigate to different pages and handle back navigation.
 * To be used in the feed of user.
 * Specifically to make the user navigate to Institution profile from anywhere on the application.
 * User can open the Institute profile page from its userPage, Discover Page, Framez page.
 * This component also allows the user to return to the same page from where the user clicked the profile button.
 *
 * Provider: 'NavigationProvider'
 * This component wraps the application or part of the application where navigation state is needed. It provides the navigation context to its children.
 * Props:
 *  'childern' : The child components that will have accesss to the navigation context.
 */

import React, { createContext, useContext, useState, useEffect } from "react"

const NavigationContext = createContext()

export const NavigationProvider = ({ children }) => {
  /**
   * State:
   *  'pageNumber'  @int The current page number
   *  'previousPage'  @int The previous page number to allow back navigation.
   */
  const [pageNumber, setPageNumber] = useState(1)
  const [previousPage, setPreviousPage] = useState(1)
  const [institutionID, setInstitutionID] = useState("")

  /**
   * The `navigateToPage` function updates the page number and stores the previous page number.
   */
  const navigateToPage = (newPageNumber, id) => {
    setPreviousPage(pageNumber)
    setPageNumber(newPageNumber)
    setInstitutionID(id)
  }

  /**
   * The function `goBack` is used to navigate to the previous page by setting the page number to the
   * previous page.
   */
  const goBack = () => {
    setPageNumber(previousPage)
  }

  return (
    <NavigationContext.Provider
      value={{ pageNumber, navigateToPage, goBack, institutionID }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

/**
 * HOOK: useNavigation
 * This hook will provide access to the navigation context values and functions
 * @returns
 *  @int pageNumber  The current page number.
 *  @function NaviageteToPage function to navigate to a new page.
 *  @function goBack  function to navigate back to the previous page.
 *  @String institutionID id of the institution
 */
const useNavigation = () => useContext(NavigationContext)

export default useNavigation
