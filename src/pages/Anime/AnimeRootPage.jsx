import { ChevronDown, Plus, Square, SquarePlus } from "lucide-react";
import { useSearchParams } from "react-router";
import FilterComponent from "../../components/anime/FilterComponent";
import { useState } from "react";

export default function AnimeRootPage() {
  const headerData = { type: ["tv", "movie", "ova", "ona"] };
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParamStore, setSearchParamsStore] = useState(searchParams);

  function handleSearchParam(newParam) {
    setSearchParamsStore((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      Object.keys(newParam).forEach((key) => {
        const newValue = newParam[key];
        const exisitingValues = updatedParams.has(key) ? updatedParams.get(key).split(",") : [];
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
      });
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
            <div id="search">
              <input type="search" name="searchBar" id="searchBar" placeholder="search..." />
            </div>

            {Object.keys(headerData).map((key, i) => (
              <FilterComponent key={i} keyName={key} data={headerData[key]} handleSearchParam={handleSearchParam} searchParams={searchParamStore} />
            ))}

            <div id="genre"></div>
            <div id="status"></div>
            <div id="sort"></div>
            <div
              id="filterBtn"
              onClick={() => {
                setSearchParams(searchParamStore);
              }}
            >
              filter
            </div>
          </div>
        </div>
      </div>
      <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
        <img src="/photo-bg.png" alt="" className="w-full h-full object-cover bg-no-repeat opacity-35 contrast-115" />
      </div>
    </div>
  );
}
