import { ChevronDown, Info, Plus, Square, SquarePlus } from "lucide-react";
import { useSearchParams } from "react-router";
import FilterComponent from "../../components/anime/filters/FilterComponent";
import { useEffect, useRef, useState } from "react";
import GenresFilter from "../../components/anime/filters/GenresFilter";
import KeywordFilter from "../../components/anime/filters/KeywordFilter";
import data from "../../utility/data.json";
import SortFilter from "../../components/anime/filters/SortFilter";
import ExtraFilters from "../../components/anime/filters/ExtraFilters/ExtraFilters";
import AnimeContainer from "../../components/anime/AnimeContainer";

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
    const genres = collectorStore.current.genres();
    const sort = collectorStore.current.sort();
    const score = collectorStore.current.score();
    const rating = collectorStore.current.rating();
    const date = collectorStore.current.date();

    setSearchParams({
      type,
      status,
      q: keyword,
      genres: genres.genres.join(","),
      genres_exclude: genres.genres_exclude.join(","),
      order_by: sort.order_by,
      sort: sort.sort,
      min_score: score.min_score,
      max_score: score.max_score,
      rating,
      start_date: date.start_date,
      end_date: date.end_date,
    });
  }

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams({
        type: "tv",
        status: "complete",
        q:"",
        genres: "",
        genres_exclude: "",
        order_by: "start_date",
        sort: "desc",
        min_score: 0,
        max_score: 10,
        rating: "",
        start_date: new Date(new Date().getFullYear(), 0, 1).toLocaleDateString("en-CA"),
        end_date: "",
      });
    }
  }, []);

  return (
    <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3">
      <div className="w-[95vw] flex flex-col ">
        <div id="title" className="order-1 mt-5 px-5 py-1 uppercase font-bold text-xl">
          Browser
        </div>
        <div className="order-2 px-3 py-1">
          <div id="disclaimer" className="w-full mb-2 flex flex-row items-center gap-x-2 py-1.5 px-2.5 box-colors border border-indigo-600/60 rounded-r-md text-2xs">
            <Info size={15} />
            <p className="flex flex-row items-center gap-x-1.5">
              <span className="font-medium">Jikan API uses AND logic for genre filters.</span>
              <span className="">Included genres are capped at</span>
              <span className="inline-flex items-center badge badge-outline badge-primary text-[1em] px-1.5 py-0.5 h-fit rounded-full">max 3 (1 recommended)</span>
              <span>-</span>
              <span>excluded genres have no cap.</span>
            </p>
          </div>

          <div id="header" className="z-30 relative w-full flex flex-row items-center justify-center gap-x-4 capitalize text-2xs font-light">
            <KeywordFilter registerCollector={(fn) => (collectorStore.current.keyword = fn)} />

            {Object.keys(filterData).map((key, i) => (
              <FilterComponent key={i} keyName={key} data={filterData[key]} registerCollector={(fn) => (collectorStore.current[key] = fn)} />
            ))}

            <GenresFilter data={genresData} registerCollector={(fn) => (collectorStore.current.genres = fn)} />

            <SortFilter data={sortData} registerCollector={(fn) => (collectorStore.current.sort = fn)} />

            <ExtraFilters
              registerCollectors={{
                scoreCollector: (fn) => (collectorStore.current.score = fn),
                ratingCollector: (fn) => (collectorStore.current.rating = fn),
                dateCollector: (fn) => (collectorStore.current.date = fn),
              }}
            />
            <div id="filterBtn" className=" header-box box-colors-stronger hover:cursor-pointer" onClick={handleApplyFilter}>
              <p className="px-2">filter</p>
            </div>
          </div>
        </div>
        <AnimeContainer searchParams={searchParams} />
      </div>
      <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
        <img src="/photo-bg.png" alt="" className="w-full h-full object-cover bg-no-repeat opacity-30 contrast-125" />
      </div>
    </div>
  );
}
