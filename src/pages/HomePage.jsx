import HomeSlider from "../components/home/HomeSlider";
import { useQueries } from "@tanstack/react-query";
import { data } from "react-router";
import Recent from "../components/home/RecentAnime";
import RecentAnime from "../components/home/RecentAnime";
import RecentManga from "../components/home/RecentManga";

export default function HomePage() {
  const [seasonQ] = useQueries({
    queries: [
      {
        queryKey: ["seasonListData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/seasons/now?filter=tv&limit=10?filter=tv&limit=15");
          if (!res.ok) throw new Error(res.statusText);
          const season_Data = await res.json();
          const uniqueSeasonData = [...new Set(season_Data.data.map((elm) => elm.mal_id))].map((id) => season_Data.data.find((item) => item.mal_id === id));
          return { ...season_Data, uniqueSeasonData };
        },
      },
    ],
  });

  return (
    <div className="relative w-screen">
      {seasonQ.isPending ? <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div> : <HomeSlider season={seasonQ?.data?.uniqueSeasonData?.slice(0, 10)} />}
      <div className="w-full py-3 px-5 flex flex-col">
        <div className="text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase">Latest Updates</div>
        <RecentAnime />
        <RecentManga />
      </div>
    </div>
  );
}
