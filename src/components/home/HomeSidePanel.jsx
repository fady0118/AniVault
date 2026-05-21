import { useQueries } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import Schedual from "./Schedual";

export default function HomeSidePanel() {
  const [TrendingAnimeQ] = useQueries({
    queries: [
      {
        queryKey: ["recentMangaData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=tv&sfw=true&status=airing&order_by=popularity&sort=asc&limit=15");
          if (!res.ok) throw new Error(res.statusText);
          const trendingAnimeData = await res.json();
          const uniqueTrendingAnimeData = [...new Set(trendingAnimeData.data.map((elm) => elm.mal_id))].map((id) => trendingAnimeData.data.find((item) => item.mal_id === id));
          return uniqueTrendingAnimeData;
        },
      },
    ],
  });
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 min-w-0 h-fit">
      <div id="Trending" className="w-full flex flex-col rounded-lg box-colors py-2 gap-y-3 mt-3 h-fit text-[1.1em]">
        <div className="flex flex-row gap-x-2 items-center px-3">
          <Trophy className="stroke-3" size={20} />
          <p className="uppercase font-bold text-sm/relaxed sm:text-lg/relaxed">Trending</p>
        </div>
        <div className="flex flex-col text-[0.65em]">
          {TrendingAnimeQ.isPending ? (
            <>
              {Array.from({ length: 10 }, (_, i) => i).map((i) => (
                <div className="h-10 w-full"></div>
              ))}
            </>
          ) : (
            <>
              {TrendingAnimeQ?.data?.slice(0, 10).map((item, i) => (
                <a key={item?.mal_id || i} href={`/anime/${item?.mal_id}`}>
                  <div className="group flex flex-row gap-x-1.5 items-center px-3 py-1 hover:bg-blue-600/5 dark:hover:bg-blue-300/5 duration-200">
                    <img
                      className="shrink-0 w-1/9 max-w-10 min-w-5 aspect-square object-cover rounded-full"
                      src={item?.images?.webp?.image_url || item?.images?.jpg?.image_url}
                      alt={item?.title || ""}
                    />
                    <p className="group-hover:text-blue-600 dark:group-hover:text-blue-300 duration-200">{item?.title}</p>
                  </div>
                </a>
              ))}
            </>
          )}
        </div>
      </div>
      <Schedual />
    </div>
  );
}
