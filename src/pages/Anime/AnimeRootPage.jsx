import { ChevronDown, Plus, Square, SquarePlus } from "lucide-react";
import { useSearchParams } from "react-router";
import FilterComponent from "../../components/anime/filters/FilterComponent";
import { useEffect, useRef, useState } from "react";
import GenresFilter from "../../components/anime/filters/GenresFilter";
import KeywordFilter from "../../components/anime/filters/KeywordFilter";
import data from "../../utility/data.json";
import SortFilter from "../../components/anime/filters/SortFilter";
import ExtraFilters from "../../components/anime/filters/ExtraFilters/ExtraFilters";

const filterData = { type: ["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv_special"], status: ["airing", "complete", "upcoming"] };
const genresData = [...data.genres, ...data.themes];
const sortData = ["mal_id", "title", "start_date", "end_date", "episodes", "score", "scored_by", "rank", "popularity", "members", "favorites"];

export default function AnimeRootPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const collectorStore = useRef({});

  function handleApplyFilter() {
    const type = collectorStore.current.type();
    const status = collectorStore.current.status();
    const keyword = collectorStore.current.keyword();
    const genres = collectorStore.current.genres()
    const sort = collectorStore.current.sort()
    const score = collectorStore.current.score();
    setSearchParams({ type, status, q: keyword, genres:genres.genres.join(','), genres_exclude: genres.genres_exclude.join(','), order_by:sort.order_by, sort:sort.sort, min_score: score.min_score, max_score:score.max_score});
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3">
      <div className="w-[95vw] flex flex-col space-y-3">
        <div id="title" className="order-1 mt-5 px-5 py-1 uppercase font-bold text-xl">
          Browser
        </div>
        <div className="order-1 mt-5 px-3 py-1">
          <div id="header" className="relative w-full flex flex-row items-center justify-center gap-x-4 capitalize text-2xs font-light">
            <KeywordFilter registerCollector={(fn) => (collectorStore.current.keyword = fn)} />

            {Object.keys(filterData).map((key, i) => (
              <FilterComponent key={i} keyName={key} data={filterData[key]} registerCollector={(fn) => (collectorStore.current[key] = fn)} />
            ))}

            <GenresFilter data={genresData} registerCollector={(fn) => (collectorStore.current.genres = fn)} />
            
            <SortFilter data={sortData} registerCollector={(fn) => (collectorStore.current.sort = fn)} />

            <ExtraFilters registerCollectors={{scoreCollector:(fn) => (collectorStore.current.score = fn)}} />
            <div id="filterBtn" className=" header-box box-colors-stronger hover:cursor-pointer" onClick={handleApplyFilter}>
              <p className="px-2">filter</p>
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
