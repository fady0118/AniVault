import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { jikanFetch } from "../../utility/jikanApi";
import { ChevronLeft } from "lucide-react";
import { RootContext } from "../../App";
import { Link } from "react-router";
import LoaderComponent from "../LoaderComponent";

const classes = { chevron: "p-0.5 rounded-md box-content duration-200 scale-80 md:scale-100" };
export default function AnimeMangaContainer({ searchParams, itemType }) {
  // type & status are enums in the api so we need to seperate them from the other params and fetch in parallel
  const types = useMemo(() => searchParams.get("type"), [searchParams]);
  const statuses = useMemo(() => searchParams.get("status"), [searchParams]);

  const typeList = useMemo(() => (types ? types?.split(",") : [""]), [types]);
  const statusList = useMemo(() => (statuses ? statuses?.split(",") : [""]), [statuses]);
  const { SFW } = useContext(RootContext);
  const rest = useMemo(
    () =>
      new URLSearchParams({
        genres: searchParams.get("genres") || "",
        genres_exclude: searchParams.get("genres_exclude") || "",
        q: searchParams.get("q") || "",
        order_by: searchParams.get("order_by") || "",
        sort: searchParams.get("sort") || "",
        min_score: searchParams.get("min_score") || "",
        max_score: searchParams.get("max_score") || "",
        rating: searchParams.get("rating") || "",
        start_date: searchParams.get("start_date") || "",
        end_date: searchParams.get("end_date") || "",
      }),
    [searchParams],
  );

  // currentPage state for query pagination
  const [currentPage, setCurrentPage] = useState(1);
  // pagination last available Page
  const [lastPageIndex, setLastIndexPage] = useState(null);
  // queries ref for holding hasNext value
  const pageStateRef = useRef({ queries: {} });
  // state derived from pageStateRef used for pagination swap to next page
  const [queriesHaveNext, setqueriesHaveNext] = useState(null);

  // reset states & ref if searchParams change
  useEffect(() => {
    pageStateRef.current = { queries: {} };
    setCurrentPage(1);
    setqueriesHaveNext(null);
  }, [rest, types, statuses]);

  typeList.forEach((type) => {
    statusList.forEach((status) => {
      const key = `${type}|${status}`;
      if (!pageStateRef.current.queries[key]) {
        pageStateRef.current.queries[key] = { hasNext: null };
      }
    });
  });

  // fetch data
  const queries = useQueries({
    queries: typeList.flatMap((type) =>
      statusList.map((status) => {
        const key = `${type}|${status}`;
        const state = pageStateRef.current.queries[key];
        return {
          queryKey: ["itemTypeData", rest.toString(), itemType, type, status, currentPage, SFW],
          queryFn: async () => {
            const res = await jikanFetch(`https://api.jikan.moe/v4/${itemType}?${rest}&type=${type}&status=${status}&page=${currentPage}`);
            if (!res.ok) throw new Error(res.statusText);
            return await res.json();
          },
          // query enable condition depends on prev fetch hasNext value
          enabled: state.hasNext !== false,
        };
      }),
    ),
  });
  const isLoading = queries.some((q) => q.isLoading);
  const uniqueData = [...new Map(queries.flatMap((q) => q.data?.data ?? []).map((item) => [item.mal_id, item])).values()];

  const queryClient = useQueryClient();

  // pagination details update, updates on query or currentPage change
  useEffect(() => {
    let last_visible_page = null;
    queries.forEach((q, i) => {
      // retrun if query failed
      if (!q.isSuccess || !q.data) return;
      // get query key
      const type = typeList[Math.floor(i / statusList.length)];
      const status = statusList[i % statusList.length];
      const key = `${type}|${status}`;
      // update pageStateRef hasNext values
      const hasNext = q.data.pagination?.has_next_page ?? false;
      if (hasNext) {
        pageStateRef.current.queries[key] = { hasNext: true };
      } else {
        pageStateRef.current.queries[key] = { hasNext: false };
      }
      // update last_visible_page value
      if (!last_visible_page || last_visible_page < q.data.pagination?.last_visible_page) last_visible_page = q.data.pagination.last_visible_page;
    });
    // update states
    setLastIndexPage(last_visible_page);
    setqueriesHaveNext(checkNext());
  }, [queries, currentPage]);

  // navigate between pages
  function pageSwap(dir) {
    const prevState = pageStateRef.current;
    if (dir === "prev") {
      if (currentPage === 1) return;
      Object.keys(prevState.queries).forEach((key) => {
        prevState.queries[key] = { hasNext: null };
      });
      setqueriesHaveNext(null);
      pageStateRef.current = prevState;
      setCurrentPage((s) => s - 1);
    } else if (dir === "next") {
      if (!checkNext()) return;
      Object.keys(prevState.queries).forEach((key) => {
        if (prevState.queries[key].hasNext === true) {
          prevState.queries[key] = { hasNext: null };
        }
      });
      setqueriesHaveNext(null);
      pageStateRef.current = prevState;
      setCurrentPage((s) => s + 1);
    } else return;
    // trigger refetching
    queryClient.invalidateQueries({ queryKey: ["itemTypeData", rest.toString(), SFW] });
  }

  // a function to determine if one of the queries in pageStateRef has a next page
  function checkNext() {
    const hasNext = Object.values(pageStateRef.current.queries).some((q) => q.hasNext === true);
    return hasNext;
  }

  return (
    <div className="relative order-3 px-3 py-1 min-h-32 text-xs">
      {isLoading ? (
        <>
          <div className="absolute top-full left-1/2 -translate-1/2">
            <LoaderComponent size={2} />
          </div>
        </>
      ) : (
        <>
          <div className="w-fit flex flex-row items-center py-0.5 px-2 text-[0.8em] md:text-[1em] box-colors-stronger rounded-lg">
            <p className="px-2 py-0.5 rounded-md hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20 duration-200" onClick={() => setCurrentPage(1)}>
              1
            </p>
            <div className="flex flex-row items-center gap-x-2">
              <ChevronLeft
                onClick={() => pageSwap("prev")}
                size={20}
                className={`${classes.chevron} ${currentPage > 1 ? "hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20" : "stroke-text-light/25 dark:stroke-text-dark/25"}`}
              />
              {currentPage}
              <ChevronLeft
                onClick={() => pageSwap("next")}
                size={20}
                className={`rotate-180 ${classes.chevron} ${queriesHaveNext ? "hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20" : "stroke-text-light/25 dark:stroke-text-dark/25"}`}
              />
            </div>
            <p
              className="px-2 py-0.5 rounded-md hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20 duration-200"
              onClick={() => {
                setCurrentPage(lastPageIndex);
              }}
            >
              {lastPageIndex || "?"}
            </p>
          </div>

          <div className="py-2 grid grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
            {uniqueData?.map((item) => (
              <div key={item.mal_id} className="group relative w-full aspect-2/3 rounded-md overflow-hidden  flex-col hover:scale-105 hover:cursor-pointer duration-200">
                <Link to={`/${itemType}/${item.mal_id}`}>
                  <img
                    src={item.images.webp.large_image_url || item.images.webp.image_url || item.images.jpg.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover text-2xs group-hover:brightness-65 duration-200"
                  />
                </Link>
                <div className="absolute bottom-0 left-0 w-full max-h-2/3 box-colors-medium translate-y-full group-hover:translate-y-0.5 duration-200">
                  <div className="w-full h-full flex flex-col p-1.5 gap-y-1 text-3xs">
                    <p className="text-[1.3em] font-bold">{item.title_english || item.title}</p>
                    <div className="flex flex-row items-center flex-wrap">
                      <p className="">{item.status}</p>
                      {item.status.toLowerCase() === "not yet aired" ? <p>&nbsp;-&nbsp;{item.aired.string}</p> : <>{item.score ? <p className="">&nbsp;-&nbsp;{item.score}</p> : ""}</>}
                    </div>
                    {item.themes.length ? (
                      <div className="flex flex-row flex-wrap gap-x-1">
                        {item.genres.map((genres, i) => (
                          <Link
                            key={i}
                            to={`/${itemType}?genres=${genres.mal_id}`}
                            className="font-light rounded-full px-1 m-0.5 box-colors-accent hover:cursor-pointer hover-indigo-link duration-200"
                          >
                            {genres.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
