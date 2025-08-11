import React, { useState, useEffect } from "react";
import FeedMenu from "./Common/FeedMenu";
import FeedUserControl from "./Common/FeedUserControl";
import UserPage from "./Components/UserPage";
import Explore from "./Components/Explore";
import Search from "./Components/Search";
import Reels from "./Components/Klipz";
import RightSection from "./Common/RightSection";
import InstitutionProfile from "./Components/InstitutionProfile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Package2 } from "lucide-react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import StickyBox from "react-sticky-box";

// -H
// To implement institutionProfile click from anywhere on the application
import useNavigation from "@/feature/NavigationContext";
import SinglePost from "./Components/single-post/SinglePost";

const Feed = () => {
  // for navigation and institution Profile
  /* The line `const { pageNumber, navigateToPage, goBack, institutionID } = useNavigation()` is using
  object destructuring to extract specific values from the return object of the `useNavigation()`
  hook. */
  const { pageNumber, navigateToPage, goBack, institutionID } = useNavigation();
  // contains all the pages present inside the menu
  // the first one is '0' to prevent logical error in the conditional statement where 0 && <with component/> will result in 0 everytime
  const [page, setPage] = useState([
    0,
    <UserPage />,
    <Search />,
    <Explore />,
    <Reels />,
    // <InstitutionProfile onBack={goBack} id={institutionID} />,
  ]);
  // set page number
  // const [pageNumber, setPageNumber] = useState(1)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Home");

  // changes the page number
  const onPageChange = (newPage, newPageTitle) => {
    navigateToPage(parseInt(newPage + 1), ""); // adds one for logical reason and modulas with 5 to keep within range this is a redundant error check but can be usefull
    setIsSheetOpen(false); // Close the sheet when the page changes
    setPageTitle(newPageTitle);
  };

  /* The `useEffect` hook in the provided code snippet is responsible for updating the `page` state in
the `Feed` component whenever there is a change in the `institutionID` or `goBack` values
<InstitutionProfile/> can't be places in the array page as the data being passed can only be made available when the institutionID is changed in navigation context only
otherwise it passes a null value 
this breaks the page when rendering as useState is async and the institutionID gets updated only after the institution page is rendered with errors
*/
  useEffect(() => {
    setPage((prevPages) => {
      const updatedPages = [...prevPages];
      updatedPages[5] = (
        <InstitutionProfile onBack={goBack} id={institutionID} />
      );
      return updatedPages;
    });
  }, [institutionID, goBack]);

  return (
    <div className="h-screen flex flex-row">
      {/* Hide menu on sm devices */}
      <div className="hidden sm:contents">
        <FeedMenu changePage={onPageChange} />
      </div>

      <div className="w-full overflow-y-auto">
        <StickyBox className="z-40 bg-white">
          <div className="flex items-center p-2 justify-between sm:justify-end">
            {/* Show Sheet on sm devices */}
            <div className="sm:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="py-1 px-2">
                    <Package2 />
                    {/* <div className="ml-2 mr-2 font-bold text-[16px]">
                      {pageTitle}
                    </div> */}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-fit p-1 bg-[#B794FA] ">
                  <FeedMenu changePage={onPageChange} />
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="sm:hidden font-semibold">{pageTitle}</h2>
            <FeedUserControl />
          </div>
        </StickyBox>

        {/* For Explore Page no need of RightSection  */}
        <div className="block sm:flex ">
          {pageNumber === 3 ? (
            <div className="m-2 w-full">
              {pageNumber && page[pageNumber] ? page[pageNumber] : pageNumber}
            </div>
          ) : (
            <>
              <div className="m-2 w-full sm:w-[70%]">
                {pageNumber && page[pageNumber] ? page[pageNumber] : pageNumber}
              </div>
              <div className="m-2 hidden sm:block sm:w-[30%]">
                <RightSection />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
