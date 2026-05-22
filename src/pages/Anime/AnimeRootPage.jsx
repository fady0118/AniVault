import { ChevronDown, Plus, Square, SquarePlus } from "lucide-react";
import { useSearchParams } from "react-router";
import FilterComponent from "../../components/anime/FilterComponent";
import { useEffect, useState } from "react";
import SearchBar from "../../components/anime/SearchBar";

export default function AnimeRootPage() {
  const headerData = { type: ["tv", "movie", "ova", "ona", "special", "tv_special"], status: ["airing", "complete", "upcoming"] };
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParamStore, setSearchParamsStore] = useState(searchParams);

  // update search parameters in the searchParamsStore state
  function handleSearchParam(newParam) {
    setSearchParamsStore((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      Object.keys(newParam).forEach((key) => {
        const newValue = newParam[key];
        const exisitingValues = updatedParams.has(key) ? updatedParams.get(key).split(",") : [];
        if (key === "q") {
          updatedParams.set(key, newValue.trim());
        } else {
          if (exisitingValues.includes(newValue)) {
            const filtered = exisitingValues.filter((item) => item !== newValue);
            if (filtered.length) {
              updatedParams.set(key, filtered.join(","));
            } else {
              updatedParams.delete(key);
            }
          } else {
            updatedParams.set(key, [...exisitingValues, newValue].join(","));
          }
        }
      });
      return updatedParams;
    });
  }

  // seperate update searchParam function exclusively for the searchBar
  function handleKeywordSearchParam(newParam) {
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("q", newParam.q);
      return updatedParams;
    });
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3">
      <div className="w-[95vw] flex flex-col space-y-3">
        <div id="title" className="order-1 mt-5 px-5 py-1 uppercase font-bold text-xl">
          Browser
        </div>
        <div className="order-1 mt-5 px-3 py-1">
          <div id="header" className="w-full flex flex-row items-center justify-center gap-x-4 capitalize text-2xs font-light">
            <SearchBar handleKeywordSearchParam={handleKeywordSearchParam} searchParams={searchParamStore} setSearchParamsStore={setSearchParamsStore} />

            {Object.keys(headerData).map((key, i) => (
              <FilterComponent key={i} keyName={key} data={headerData[key]} handleSearchParam={handleSearchParam} searchParams={searchParamStore} />
            ))}

            <div id="genre"></div>
            <div id="sort"></div>
            <div
              id="filterBtn"
              onClick={() => {
                // update the searchParams
                setSearchParams(searchParamStore);
              }}
            >
              filter
            </div>
          </div>
        </div>
      </div>
      <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
        <img src="/photo-bg.png" alt="" className="w-full h-full object-cover bg-no-repeat opacity-35 contrast-125" />
      </div>
    </div>
  );
}
