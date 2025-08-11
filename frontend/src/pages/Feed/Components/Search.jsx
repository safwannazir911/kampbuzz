import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import url from "@/feature/url";


// to implement loading animation
import { SearchSkeleton } from "@/components/Loaders";
// Implement institution profile navigation
import useNavigation from "@/feature/NavigationContext";
import { X } from "lucide-react";

const RECENT_SEARCHES_KEY = "recentSearches";

//Search Institution
const InstitutionSearch = () => {
  const [query, setQuery] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);

  // to temporary store search query in state
  const [recentSearch, setRecentSearch] = useState([]);
  // using navigation hook
  const { navigateToPage } = useNavigation();

  const link = url();
  const fetchInstitutions = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(`${link}/search`, {
        params: {
          q: searchQuery,
        },
      });
      console.log(response.data.data);
      setInstitutions(response.data.data);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchInstitutions = useCallback(
    debounce(fetchInstitutions, 500),
    [],
  );
  const source =
    "https://images.unsplash.com/20/cambridge.JPG?q=80&w=1147&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    if (query) {
      debouncedFetchInstitutions(query);
    } else {
      setInstitutions([]);
    }
  }, [query, debouncedFetchInstitutions]);

  /* The `useEffect` hook in the provided code snippet is responsible for loading and setting the recent
search data from the local storage when the component mounts for the first time. Here's a breakdown
of what it does: */
  useEffect(() => {
    const storedSearch = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearch) {
      setRecentSearch(JSON.parse(storedSearch));
    }
  }, []);

  /**
   * The function `handleInstitutionClick` updates the recent searches list, saves it to local storage,
   * and navigates to a specific page based on the clicked institution.
   */
  const handleInstitutionClick = (institution) => {
    const updatedSearches = [
      institution,
      ...recentSearch.filter((i) => i._id !== institution._id),
    ];
    setRecentSearch(updatedSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    navigateToPage(5, institution._id);
  };

  /**
   * The function `handleRemoveRecentSearch` removes a recent search item from a list and updates the
   * state and local storage accordingly.
   */
  const handleRemoveRecentSearch = (e, id) => {
    e.stopPropagation();
    const updatedSearches = recentSearch.filter((search) => search._id !== id);
    setRecentSearch(updatedSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  };

  return (
    <div className="container mx-auto p-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search institutions..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="mt-4">
        {loading ? (
          <SearchSkeleton />
        ) : institutions.length > 0 ? (
          <ul>
            {institutions.map((institution) => (
              <li
                key={institution._id}
                className="p-4 border-b border-gray-200 cursor-pointer"
                onClick={() => handleInstitutionClick(institution)}
              >
                <div className="flex flex-row items-center">
                  <Avatar className="mr-2">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-base font-semibold">
                      {institution.name}
                    </h2>
                    <p>{institution.address}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : query.length === 0 ? (
          recentSearch.length > 0 ? (
            <div>
              <h3 className="mt-8 text-2xl font-semibold text-purple-800">
                Recent Searches
              </h3>
              <ul>
                {recentSearch.map((institution) => (
                  <li
                    key={institution._id}
                    className="p-4 border-b border-gray-200 cursor-pointer flex justify-between"
                    onClick={() => handleInstitutionClick(institution)}
                  >
                    <div className="flex flex-row items-center">
                      <Avatar className="mr-2">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-base font-semibold">
                          {institution.name}
                        </h2>
                        <p>{institution.address}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) =>
                        handleRemoveRecentSearch(e, institution._id)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <X />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <h3 className="mt-8 text-2xl font-semibold text-purple-800">
              Your search starts here.
            </h3>
          )
        ) : (
          <h3 className="mt-8 text-2xl font-semibold text-purple-800">
            No results found!
          </h3>
        )}
      </div>
    </div>
  );
};

export default InstitutionSearch;
