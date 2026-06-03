import { useQueries } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import Schedual from "./Schedual";
import { jikanFetch } from "../../utility/jikanApi";
import { Link } from "react-router";
import LoaderComponent from "../LoaderComponent";

export default function HomeSidePanel() {
  const [TrendingAnimeQ] = useQueries({
    queries: [
      {
        queryKey: ["recentMangaData"],
        queryFn: async () => {
          const res = await jikanFetch("https://api.jikan.moe/v4/anime?type=tv&sfw=true&status=airing&order_by=popularity&sort=asc&limit=15");
          if (!res.ok) throw new Error(res.statusText);
          const trendingAnimeData = await res.json();
          const uniqueTrendingAnimeData = [...new Map(trendingAnimeData.data.map((item) => [item.mal_id, item])).values()];
          return uniqueTrendingAnimeData;
        },
      },
    ],
  });
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 min-w-0 h-fit flex flex-col xs:flex-row md:flex-col mt-3 gap-4">
      <div id="Trending" className="w-full xs:w-1/2 md:w-full flex flex-col rounded-lg box-colors-lighter py-2 gap-y-2 min-h-64 text-[1.1em]">
        <div className="flex flex-row gap-x-3 items-center px-3">
          <Trophy size={20} />
          <p className="uppercase font-extrabold text-sm/loose sm:text-lg/loose">Trending</p>
        </div>
        <div className="flex flex-col text-[0.65em]">
          {TrendingAnimeQ.isPending ? (
            <>
              <div className="w-full h-full flex flex-row justify-center items-center text-text-light-50 dark:text-text-dark-50"><LoaderComponent size={1} /></div>
            </>
          ) : (
            <>
              {TrendingAnimeQ?.data?.slice(0, 10).map((item, i) => (
                <Link key={item?.mal_id || i} to={`/anime/${item?.mal_id}`}>
                  <div className="group flex flex-row gap-x-1.5 items-center px-3 py-1 hover:bg-blue-600/5 dark:hover:bg-blue-300/5 duration-200">
                    <img
                      className="shrink-0 w-1/9 max-w-10 min-w-5 aspect-square object-cover rounded-full"
                      src={item?.images?.webp?.image_url || item?.images?.jpg?.image_url}
                      alt={item?.title || ""}
                    />
                    <p className="group-hover:text-blue-600 dark:group-hover:text-blue-300 duration-200">{item?.title}</p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
      <Schedual />
    </div>
  );
}
