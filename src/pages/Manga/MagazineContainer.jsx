import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { jikanFetch } from "../../utility/jikanApi";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import LoaderComponent from "../../components/LoaderComponent";
import EmptyDataFallback from "../../components/EmptyDataFallback";

const classes = { chevron: "p-0.5 rounded-md box-content duration-200 scale-80 md:scale-100" };
export default function MagazineContainer({ searchParams }) {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      order_by: searchParams.get("order_by") || "",
      sort: searchParams.get("sort") || "",
    }),
    [searchParams],
  );
  const magazinesQ = useQuery({
    queryKey: ["magazines", params, currentPage],
    queryFn: async () => {
      const res = await jikanFetch(`https://api.jikan.moe/v4/magazines?q=${params.q}&order_by=${params.order_by}&sort=${params.sort}&page=${currentPage}`);
      const data = await res.json();
      return data;
    },
  });

  function pageSwap(dir) {
    if (dir === "prev") {
      if (currentPage > 1) {
        setCurrentPage((s) => s - 1);
      }
    } else if (dir === "next") {
      if (currentPage < magazinesQ?.data?.pagination?.last_visible_page) {
        setCurrentPage((s) => s + 1);
      }
    }
  }
  return (
    <div className="relative order-3 px-3 py-1 min-h-32">
      {magazinesQ.isPending ? (
        <>
          <div className="absolute top-full left-1/2 -translate-1/2">
            <LoaderComponent />
          </div>
        </>
      ) : (
        <>
          <div className="w-fit flex flex-row items-center py-0.5 text-xs box-colors-stronger rounded-lg">
            <div className="flex flex-row items-center gap-x-2 text-[0.8em] md:text-[1em]">
              <ChevronLeft
                onClick={() => pageSwap("prev")}
                size={20}
                className={`${classes.chevron} ${currentPage > 1 ? "hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20" : "stroke-text-light/25 dark:stroke-text-dark/25"}`}
              />
              Page {currentPage} of {magazinesQ?.data?.pagination?.last_visible_page}
              <ChevronLeft
                onClick={() => pageSwap("next")}
                size={20}
                className={`rotate-180 ${classes.chevron} ${currentPage < magazinesQ?.data?.pagination?.last_visible_page ? "hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20" : "stroke-text-light/25 dark:stroke-text-dark/25"}`}
              />
            </div>
          </div>
          {magazinesQ?.data?.data?.length ? (
            <div className="text-xs p-2 grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {magazinesQ?.data?.data?.map((item) => (
                <Link
                  key={item.mal_id}
                  to={`/manga/magazine/${item.mal_id}`}
                  className="p-2 flex flex-row items-center capitalize indigo-link hover:bg-amethyst-smoke-400/45 hover:dark:bg-dark-amethyst-smoke-200/45 border-b magazine-border-colors duration-200"
                >
                  <ChevronLeft className="rotate-180" size={13} />{" "}
                  <p>
                    {item.name} ({item.count})
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-xs p-2">
              <EmptyDataFallback string="no magazines found, try a different query" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
