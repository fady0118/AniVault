import { useCallback, useEffect, useState } from "react";
import HomeSlider from "../components/home/HomeSlider";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const [recent, setRecent] = useState("tv");
  const [seasonQ, recentQ] = useQueries({
    queries: [
      {
        queryKey: ["seasonListData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/seasons/now?filter=tv&limit=10?filter=tv&limit=10");
          if (!res.ok) throw new Error(res.statusText);
          const season_Data = await res.json();
          return season_Data;
        },
      },
      {
        queryKey: ["recentTvData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=tv&status=airing&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentTvData = await res.json();
          return recentTvData;
        },
      },
      {
        queryKey: ["recentMovieData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=movie&status=complete&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentTvData = await res.json();
          return recentTvData;
        },
      },
    ],
  });

  return (
    <div className="relative w-screen">
      {seasonQ.isPending ? <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div> : <HomeSlider season={seasonQ.data.data} />}
      <div className="w-full p-3">
        <div id="recent" className="mt-2">
          <div className="flex flex-row w-full px-3 justify-between items-center text-xl/relaxed font-extrabold uppercase">
            <div>Latest Updates</div>
            <div id="recentTabs" className="flex flex-row gap-x-2 items-center text-[0.65em]">
              <div
                onClick={() => {
                  setRecent("tv");
                }}
                className={`tab ${recent === "tv" ? "active-tab" : ""}`}
              >
                tv
              </div>
              <div
                onClick={() => {
                  setRecent("movie");
                }}
                className={`tab ${recent === "movie" ? "active-tab" : ""}`}
              >
                movie
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
