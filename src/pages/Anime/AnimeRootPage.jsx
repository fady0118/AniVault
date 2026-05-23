import { ChevronDown, Plus, Square, SquarePlus } from "lucide-react";
import { useSearchParams } from "react-router";
import FilterComponent from "../../components/anime/FilterComponent";
import { useEffect, useRef, useState } from "react";
import GenresFilter from "../../components/anime/GenresFilter";
import KeywordFilter from "../../components/anime/KeywordFilter";

export default function AnimeRootPage() {
  const headerData = { type: ["tv", "movie", "ova", "ona", "special", "tv_special"], status: ["airing", "complete", "upcoming"] };
  const [searchParams, setSearchParams] = useSearchParams();
  const collectorStore = useRef({});

  function handleApplyFilter() {
    const type = collectorStore.current.type();
    const status = collectorStore.current.status();
    const keyword = collectorStore.current.keyword();

    setSearchParams({ type, status, q: keyword });
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3">
      <div className="w-[95vw] flex flex-col space-y-3">
        <div id="title" className="order-1 mt-5 px-5 py-1 uppercase font-bold text-xl">
          Browser
        </div>
        <div className="order-1 mt-5 px-3 py-1">
          <div id="header" className="w-full flex flex-row items-center justify-center gap-x-4 capitalize text-2xs font-light">
            <KeywordFilter registerCollector={(fn) => (collectorStore.current.keyword = fn)} />

            {Object.keys(headerData).map((key, i) => (
              <FilterComponent key={i} keyName={key} data={headerData[key]} registerCollector={(fn) => (collectorStore.current[key] = fn)} />
            ))}

            <GenresFilter />
            <div id="sort"></div>

            <div id="filterBtn" onClick={handleApplyFilter}>
              filter
            </div>
          </div>
        </div>
      </div>
      <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
        <img src="/photo-bg.png" alt="" className="w-full h-full object-cover bg-no-repeat opacity-30  contrast-125" />
      </div>
    </div>
  );
}
