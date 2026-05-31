import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { RootContext } from "../../App";
import data from "../../utility/data.json";
import KeywordFilter from "../../components/anime/filters/KeywordFilter";
import FilterComponent from "../../components/anime/filters/FilterComponent";
import GenresFilter from "../../components/anime/filters/GenresFilter";
import SortFilter from "../../components/anime/filters/SortFilter";
import ExtraFilters from "../../components/anime/filters/ExtraFilters/ExtraFilters";
import { Info, Settings2, X } from "lucide-react";
import { delay } from "../../utility/utils";
import AnimeMangaContainer from "../../components/anime/AnimeMangaContainer";

const filterData = { type: ["manga", "novel", "lightnovel", "oneshot", "doujin", "manhwa", "manhua"], status: ["publishing", "complete", "hiatus", "discontinued", "upcoming"] };
const genresData = [...data.manga.genres, ...data.manga.themes];
const sortData = ["mal_id", "title", "start_date", "end_date", "chapters", "volumes", "score", "scored_by", "rank", "popularity", "members", "favorites"];

export default function MangaRootPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { windowWidth } = useContext(RootContext);
  const collectorStore = useRef({});
  const [showFiltersSideHeader, setShowFiltersSideHeader] = useState(false);
  const filterSideBarStateRef = useRef(false);
  const sidePanelRef = useRef(null);

  function handleApplyFilter() {
    const type = collectorStore.current.type();
    const status = collectorStore.current.status();
    const keyword = collectorStore.current.keyword();
    const genres = collectorStore.current.genres();
    const sort = collectorStore.current.sort();
    const score = collectorStore.current.score();
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
      start_date: date.start_date,
      end_date: date.end_date,
    });
  }
  const defaultSearchParams = new URLSearchParams({
    type: "manga",
    status: "",
    q: "",
    genres: "",
    genres_exclude: "",
    order_by: "start_date",
    sort: "desc",
    min_score: 0,
    max_score: 10,
    start_date: "",
    end_date: "",
  });
  const effectiveSearchParams = searchParams.size === 0 ? defaultSearchParams : searchParams;

  async function closeSidePanel() {
    sidePanelRef.current.classList.add("-translate-x-full", "duration-300");
    await delay(300);
    setShowFiltersSideHeader(false);
  }

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams(Object.fromEntries(defaultSearchParams.entries()));
    }
    const handleClicksOutside = (e) => {
      if (filterSideBarStateRef.current && !sidePanelRef?.current?.contains(e.target)) {
        closeSidePanel();
      }
    };
    document.addEventListener("mousedown", handleClicksOutside);
    return () => document.removeEventListener("mousedown", handleClicksOutside);
  }, []);

  useEffect(() => {
    filterSideBarStateRef.current = showFiltersSideHeader;
  }, [showFiltersSideHeader]);
  return (
    <>
      <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3">
        <div className="w-[95vw] flex flex-col ">
          <div id="title" className="order-1 mt-5 px-3 py-1 uppercase font-bold text-xl">
            Browser
          </div>

          <div className="order-2 px-3 py-1">
            {windowWidth > 600 ? (
              <>
                <div id="disclaimer" className="w-full mb-2 flex flex-row items-center gap-x-2 py-1.5 px-2.5 box-colors border border-indigo-600/60 rounded-r-md text-3xs xs:text-2xs">
                  <p className="flex flex-row flex-wrap items-center gap-1.5">
                    <span className="font-medium flex flex-row items-center gap-x-1.5">
                      <Info size={14} /> Jikan API uses AND logic for genre filters.
                    </span>
                    <span className="">Included genres are capped at</span>
                    <span className="inline-flex items-center badge badge-outline badge-primary text-[1em] px-1.5 py-0.5 h-fit rounded-full">max 3 (1 recommended)</span>
                    <span>excluded genres have no cap.</span>
                  </p>
                </div>
                <div id="header" className="z-30 relative w-full flex flex-row items-center justify-between md:justify-start md:gap-x-4 capitalize text-2xs font-light">
                  <KeywordFilter registerCollector={(fn) => (collectorStore.current.keyword = fn)} />

                  {Object.keys(filterData).map((key, i) => (
                    <FilterComponent key={i} keyName={key} data={filterData[key]} registerCollector={(fn) => (collectorStore.current[key] = fn)} />
                  ))}

                  <GenresFilter data={genresData} registerCollector={(fn) => (collectorStore.current.genres = fn)} />

                  <SortFilter data={sortData} registerCollector={(fn) => (collectorStore.current.sort = fn)} />

                  <ExtraFilters
                    registerCollectors={{
                      scoreCollector: (fn) => (collectorStore.current.score = fn),
                      dateCollector: (fn) => (collectorStore.current.date = fn),
                    }}
                  />
                  <div id="filterBtn" className=" header-box box-colors-stronger hover:cursor-pointer" onClick={handleApplyFilter}>
                    <p className="px-2">filter</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    setShowFiltersSideHeader(true);
                  }}
                  className="flex flex-row gap-x-1 py-0.5 px-1.5 items-center text-[0.75em] box-colors rounded-sm w-fit hover:cursor-pointer hover:brightness-115 dark:hover:brightness-125 duration-200"
                >
                  <Settings2 size={14} />
                  <span>Filters</span>
                </div>
              </>
            )}
          </div>
            <AnimeMangaContainer searchParams={effectiveSearchParams} itemType="manga" />
        </div>
        <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
          <img src="/photo-bg.png" alt="" className="w-full h-full object-cover bg-no-repeat opacity-30 contrast-125" />
        </div>
      </div>
      {showFiltersSideHeader && windowWidth <= 600 ? (
        <>
          <div ref={sidePanelRef} className="z-50 fixed top-0 left-0 w-3/4 3xs:w-2/3 box-colors backdrop-blur-2xl slide-in-from-left text-sm">
            <div className="h-screen w-full overflow-y-scroll flex flex-col gap-y-2.5 px-2 mt-3 pb-5">
              <div className="flex flex-row justify-between">
                <p className="text-xl capitalize font-bold">Filters</p>
                <X size={20} className="hover:cursor-pointer hover:scale-105 hover:bg-amethyst-smoke-500/30 box-content p-1 rounded-md duration-200" onClick={closeSidePanel} />
              </div>
              <div id="disclaimer" className="w-full mb-2 flex flex-row items-center py-1.5 px-1.5 box-colors border border-indigo-600/60 rounded-r-md text-3xs">
                <p className="flex flex-row flex-wrap items-center gap-0.5">
                  <span className="font-medium flex flex-row items-center gap-x-1.5">
                    <Info size={12} /> Jikan API uses AND logic for genre filters.
                  </span>
                  <span className="">Included genres are capped at</span>
                  <span className="inline-flex items-center badge badge-outline badge-primary text-[0.9em] px-1.5 py-0.5 h-fit rounded-full">max 3 (1 recommended)</span>
                  <span>excluded genres have no cap.</span>
                </p>
              </div>
              <KeywordFilter registerCollector={(fn) => (collectorStore.current.keyword = fn)} view="mobile" />
              {Object.keys(filterData).map((key, i) => (
                <FilterComponent key={i} keyName={key} data={filterData[key]} registerCollector={(fn) => (collectorStore.current[key] = fn)} view="mobile" />
              ))}
              <GenresFilter data={genresData} registerCollector={(fn) => (collectorStore.current.genres = fn)} view="mobile" />
              <SortFilter data={sortData} registerCollector={(fn) => (collectorStore.current.sort = fn)} view="mobile" />
              <ExtraFilters
                registerCollectors={{
                  scoreCollector: (fn) => (collectorStore.current.score = fn),
                  dateCollector: (fn) => (collectorStore.current.date = fn),
                }}
                view="mobile"
              />
              <div id="filterBtn" className="text-xs capitalize small-header-box smallHeaderBox-colors w-fit hover:cursor-pointer" onClick={handleApplyFilter}>
                <p className="px-2">filter</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
