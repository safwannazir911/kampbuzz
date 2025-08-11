/**
 * Intermediate loading component
 * Contains different types of loaders
 * Full page loader for login/signup and skeleton loader for different smaller components before the components are being populated by the API data fetch
 * is displayed between API calls
 * its active state is determined by the parent component
 * irrespective of the parent component the loading component covers the whole screen with a opace screen
 */
import React from "react";
import LoaderAnimation from "@/asset/loader.gif"; // Loader Animation asset
import Logo from "@/asset/logo.png";
import { Avatar } from "./ui/avatar";
import { Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The `PageLoader` function returns a React component that displays a loading animation with a logo.
 * @returns A JSX element representing a page loader component. It includes a fixed position div with a
 * white background and opacity, containing two images - one for a logo and another for a loading
 * animation.
 */
export function PageLoader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-90 z-50">
      <div className="flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" />
        <img src={LoaderAnimation} alt="Loading" />
      </div>
    </div>
  );
}

/**
 * The StorySkeleton function returns a React component that displays a loading skeleton for a story.
 * @returns A StorySkeleton component is being returned. It consists of a div element with specific
 * styling classes and a child div element with additional styling classes for animation.
 */
export function StorySkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center min-w-[120px] min-h-[220px] md:w-[150px] md:h-[250px] max-w-[150px] max-h-[250px] md:max-w-[150px] md:max-h-[250px] m-2 rounded-xl border-rose-500 bg-[#e1e1e1] ">
        <div className="animate-pulse w-full h-full bg-[white] blur-xl"></div>
      </div>
    </div>
  );
}

export const PostHeaderSkeleton = () => (
  <div className="p-1 flex justify-start items-start">
    <div className="flex flex-row gap-x-1.5 items-center">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col items-start">
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  </div>
);

export const PostSliderSkeleton = () => (
  <div className="mt-4">
    <Skeleton className="w-full h-64 rounded-lg" />
  </div>
);

export const PostFooterSkeleton = () => (
  <div className="mx-1.5 mt-1.5 bg-white">
    <div className="flex justify-between mt-4">
      <div className="flex flex-row gap-x-2">
        <div className="flex flex-col gap-y-1">
          <Skeleton className="w-12 h-3" />
        </div>
      </div>
      <div className="flex flex-row gap-x-4 my-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
    </div>
    <div className="text-left">
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-full h-6 mb-1" />
      <Skeleton className="w-full h-4" />
    </div>
  </div>
);

export const PostSkeleton = () => (
  <div className="p-4 bg-white border rounded-sm mt-2 ">
    <PostHeaderSkeleton />
    <PostSliderSkeleton />
    <PostFooterSkeleton />
  </div>
);


// Reels Page Loading Skeleton

export function ReelPageSkeleton() {
  return (
    <div className="flex flex-col items-center animate-pulse ">
      <div className="flex flex-col  items-start justify-end min-w-[320px] min-h-[520px] md:w-[150px] md:h-[250px] max-w-[150px] max-h-[250px] md:max-w-[150px] md:max-h-[250px] rounded-xl border-rose-500 bg-[#e1e1e1] ">
        <div className="flex m-5">
          <div className="rounded-full w-[2em] h-[2em] bg-[white] animate-pulse"></div>
          <div>
            <div className="w-[100px] h-2 bg-white m-1 rounded animate-pulse"></div>
            <div className="w-[200px] h-2 bg-[#f7f7f7] m-1 rounded animate-pulse"></div>
            <div className="w-[200px] h-2 bg-[#f7f7f7] m-1 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col  items-start justify-end min-w-[320px] min-h-[520px] md:w-[150px] md:h-[250px] max-w-[150px] max-h-[250px] md:max-w-[150px] md:max-h-[250px] rounded-xl border-rose-500 bg-[#e1e1e1] ">
        <div className="flex m-5">
          <div className="rounded-full w-[2em] h-[2em] bg-[white] animate-pulse"></div>
          <div>
            <div className="w-[100px] h-2 bg-white m-1 rounded animate-pulse"></div>
            <div className="w-[200px] h-2 bg-[#f7f7f7] m-1 rounded animate-pulse"></div>
            <div className="w-[200px] h-2 bg-[#f7f7f7] m-1 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Institution profile page skeleton
export function InstitutionProfileSkelton() {
  return (
    <div className="w-[90%] h-[50vh] bg-[#f7f7f7]  animate-pulse rounded-md relative">
      <div className="md:w-[80%] w-full h-[40vh] bg-[#e1e1e1] rounded-md absolute bottom-[-30%] md:left-[10%] left-0">
        <div className="w-full h-full flex items-center p-5">
          <Avatar className="bg-white mr-5 w-20 h-20" />
          <div className="w-[60%]">
            <div className="bg-white w-[50%] h-[24px] rounded mb-3"></div>
            <div className="bg-white w-[30%] h-[24px] rounded mb-3"></div>
            <div className="bg-white w-[80%] h-[24px] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Discover Page skeleton
export function DiscoverPageSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 mt-2 gap-2 animate-pulse">
      {Array(8)
        .fill()
        .map((_, index) => (
          <div
            key={index}
            className="border rounded-sm border-gray-300 overflow-hidden aspect-square"
          >
            <div className="bg-gray-300 w-full h-full object-cover aspect-square rounded mb-2 flex items-center justify-center">
              <Image className="text-gray-400" />
            </div>
          </div>
        ))}
    </div>
  );
}


// Search animation
export function SearchSkeleton() {
  return (
    <div className="w-full h-[10vh] border flex items-center rounded animate-pulse">
      <Avatar className="bg-[#f7f7f7] m-4" />
      <div className="w-full">
        <div className="bg-[#e1e1e1]  max-w-[220px] h-4 rounded m-1 "></div>
        <div className="bg-[#f7f7f7] max-w-[120px] h-4 rounded m-1 "></div>
      </div>
    </div>
  );
}
