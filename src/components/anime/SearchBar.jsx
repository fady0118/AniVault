import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar({ handleKeywordSearchParam, searchParams, setSearchParamsStore }) {
  // searchTerm local state
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  // keep input values in sync with the searchParamsStore
  // important for seperation of searchTerm from other filters while making the filter-button work for both
  useEffect(() => {
    setSearchParamsStore((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("q", searchValue);
      return updatedParams;
    });
  }, [searchValue]);

  return (
    <div id="search" className="header-box box-colors-stronger">
      <input
        className="outline-none"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        type="search"
        name="searchBar"
        id="searchBar"
        placeholder="search..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchValue) {
            handleKeywordSearchParam({ q: searchValue });
          }
        }}
      />
      <Search
        onClick={() => {
          handleKeywordSearchParam({ q: searchValue });
        }}
        className="hover:cursor-pointer hover:stroke-blue-500 duration-200"
        size={12}
      />
    </div>
  );
}
