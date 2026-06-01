import { useContext, useEffect, useRef, useState } from "react";
import { RootContext } from "../../App";
import { useSearchParams } from "react-router";
import { delay } from "../../utility/utils";
import KeywordFilter from "../../components/anime/filters/KeywordFilter";
import { Info, Settings2, X } from "lucide-react";
import SortFilter from "../../components/anime/filters/SortFilter";
import MagazineContainer from "./MagazineContainer";

export default function MagazinesRootPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { windowWidth } = useContext(RootContext);
  const collectorStore = useRef({});
  const [showFiltersSideHeader, setShowFiltersSideHeader] = useState(false);
  const filterSideBarStateRef = useRef(false);
  const sidePanelRef = useRef(null);

  function handleApplyFilter() {
    const keyword = collectorStore.current.keyword();
    const sort = collectorStore.current.sort();
    setSearchParams({
      q: keyword,
      order_by: sort.order_by,
      sort: sort.sort,
    });
  }
  const defaultSearchParams = new URLSearchParams({
    q: "",
    order_by: "mal_id",
    sort: "desc",
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
            Magazines
          </div>

          <div className="order-2 px-3 py-1">
            {windowWidth > 600 ? (
              <>
                <div id="header" className="z-30 relative w-full flex flex-row items-center justify-start gap-x-4 md:justify-start md:gap-x-4 capitalize text-2xs font-light">
                  <KeywordFilter registerCollector={(fn) => (collectorStore.current.keyword = fn)} />

                  <SortFilter data={["mal_id", "count"]} registerCollector={(fn) => (collectorStore.current.sort = fn)} />

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
                  className="flex flex-row gap-x-1 py-0.5 px-1.5 items-center text-[0.75em] box-colors-stronger rounded-sm w-fit hover:cursor-pointer hover:brightness-115 dark:hover:brightness-125 duration-200"
                >
                  <Settings2 size={14} />
                  <span>Filters</span>
                </div>
              </>
            )}
          </div>
          <MagazineContainer searchParams={effectiveSearchParams} />
        </div>
        <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
          <img src="/photo-bg.png" alt="" className="w-full h-full object-cover bg-no-repeat opacity-30 contrast-125" />
        </div>
      </div>
      {showFiltersSideHeader && windowWidth <= 600 ? (
        <>
          <div ref={sidePanelRef} className="z-50 fixed top-0 left-0 w-3/4 3xs:w-2/3 box-colors backdrop-blur-2xl slide-in-from-left text-[0.8em]">
            <div className="h-screen w-full overflow-y-scroll flex flex-col gap-y-2.5 px-2 mt-3 pb-5">
              <div className="flex flex-row justify-between">
                <p className="text-xl capitalize font-bold">Filters</p>
                <X size={20} className="hover:cursor-pointer hover:scale-105 hover:bg-amethyst-smoke-500/30 box-content p-1 rounded-md duration-200" onClick={closeSidePanel} />
              </div>

              <KeywordFilter registerCollector={(fn) => (collectorStore.current.keyword = fn)} view="mobile" />
              <SortFilter data={["mal_id", "count"]} registerCollector={(fn) => (collectorStore.current.sort = fn)} view="mobile" />

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
