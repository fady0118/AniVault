import { useCallback, useEffect, useRef, useState } from "react";
import HomeSlider from "../components/home/HomeSlider";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { delay } from "../utility/utils";
import AnimePopup from "../components/home/AnimePopup";
import { data } from "react-router";

export default function HomePage() {
  const [recent, setRecent] = useState("tv");
  const targetRef = useRef(null);
  const popupDataRef = useRef(null);

  const [seasonQ, recentTvQ, recentMovieQ] = useQueries({
    queries: [
      {
        queryKey: ["seasonListData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/seasons/now?filter=tv&limit=10?filter=tv&limit=15");
          if (!res.ok) throw new Error(res.statusText);
          const season_Data = await res.json();
          const uniqueSeasonData = [...new Set(season_Data.data.map((elm) => elm.mal_id))].map((id) => season_Data.data.find((item) => item.mal_id === id));
          return {...season_Data, uniqueSeasonData};
        },
      },
      {
        queryKey: ["recentTvData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=tv&status=airing&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentTvData = await res.json();
          const uniqueTvData = [...new Set(recentTvData.data.map((elm) => elm.mal_id))].map((id) => recentTvData.data.find((item) => item.mal_id === id));
          return { ...recentTvData, uniqueTvData };
        },
      },
      {
        queryKey: ["recentMovieData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=movie&status=complete&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentMovieData = await res.json();
          const uniqueMovieData = [...new Set(recentMovieData.data.map((elm) => elm.mal_id))].map((id) => recentMovieData.data.find((item) => item.mal_id === id));
          return uniqueMovieData;
        },
      },
    ],
  });

  async function handleInfoHide(e) {
    await delay(150);
    if (targetRef.current.matches(":hover")) {
      return;
    }
    targetRef.current.style.display = "none";
  }
  function handleInfoShow(e) {
    const rect = e.target.parentElement.getBoundingClientRect();
    const contRect = e.target.parentElement.parentElement.getBoundingClientRect();
    if (rect.x + rect.width >= window.innerWidth - 240) rect.x = window.innerWidth - rect.width - 260;
    if (rect.y >= window.innerHeight - 240) rect.y = window.innerHeight - 300;
    targetRef.current.style.position = "absolute";
    targetRef.current.style.left = `${rect.x + rect.width - 20}px`;
    targetRef.current.style.top = `${rect.y - contRect.y + 40}px`;
    targetRef.current.style.display = "block";

    if (recent === "tv") {
      popupDataRef.current = recentTvQ.data.data.find((i) => i.mal_id === Number(e.target.parentElement.dataset.malId));
    } else if (recent === "movie") {
      popupDataRef.current = recentMovieQ.data.data.find((i) => i.mal_id === Number(e.target.parentElement.dataset.malId));
    }
    renderPopupData();
  }
  function renderPopupData() {
    // element node ref
    const element = targetRef.current;
    // titles
    const titles = element.querySelectorAll("#titles>p");
    titles[0].textContent = popupDataRef?.current?.title;
    titles[1].textContent = popupDataRef?.current?.title_japanese;
    //rating, score
    element.querySelector("#rating>p").textContent = popupDataRef?.current?.rating;
    element.querySelector("#score>p").textContent = popupDataRef?.current?.score || "?";
    // synopsis
    element.querySelector("#synopsis>p").textContent = popupDataRef?.current?.synopsis || "no desciption found.";
    // aired, status
    element.querySelectorAll("#aired>p")[1].textContent = popupDataRef?.current?.aired?.string;
    element.querySelectorAll("#status>p")[1].textContent = popupDataRef?.current?.status;
    // genres     genres.name
    const genresDiv = element.querySelector("#genres>div");
    genresDiv.innerHTML = popupDataRef?.current?.genres?.reduce(
      (c, genre) => c + ` <p class="font-medium text-[0.9em] px-1 rounded-xl border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20">${genre.name}</p>`,
      "",
    );
  }

  return (
    <div className="relative w-screen">
      {seasonQ.isPending ? <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div> : <HomeSlider season={seasonQ?.data?.uniqueSeasonData?.slice(0,10)} />}
      <div className="w-full p-3">
        <div id="recent" className="relative flex flex-col gap-y-3 mt-3 px-3 ">
          <div className="w-full flex flex-row flex-wrap justify-between items-center text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase">
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
          <div className="w-full max-h-[75vh] grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 overflow-y-scroll overflow-x-clip gap-5 py-3">
            {recent === "tv" ? (
              <>
                {recentTvQ?.data?.uniqueTvData?.map((item, i) => (
                  <div data-mal-id={item.mal_id} key={i} className="wrapper relative flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 hover:-translate-y-1.5 duration-200">
                    <a href={`/anime/${item.mal_id}`} className="w-full aspect-3/4 rounded-lg overflow-hidden hover:brightness-75 duration-200">
                      <img
                        className="w-full h-full"
                        src={item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.image_url || item.images?.jpg?.image_url}
                        alt=""
                      />
                    </a>
                    <div className="w-full grow text-sm xs:text-xs lg:text-sm">
                      <a href={`/anime/${item.mal_id}`} className="w-full text-amethyst-smoke-950 dark:text-amethyst-smoke-300 hover-blue-link duration-200">
                        {item.title}
                      </a>
                    </div>
                    <div
                      onMouseEnter={(e) => handleInfoShow(e)}
                      onMouseLeave={(e) => handleInfoHide(e)}
                      className="target absolute top-1/25 right-1/20 rounded-full p-2 hover:cursor-pointer bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-300"
                    >
                      <Info className="stroke-blue-600 dark:stroke-blue-300 pointer-events-none" size={25} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {recentMovieQ?.data?.uniqueMovieData?.map((item, i) => (
                  <div data-mal-id={item.mal_id} key={i} className="wrapper relative flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 hover:-translate-y-1.5 duration-200">
                    <a href={`/anime/${item.mal_id}`} className="w-full aspect-3/4 rounded-lg overflow-hidden hover:brightness-75 duration-200">
                      <img
                        className="w-full h-full"
                        src={item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.image_url || item.images?.jpg?.image_url}
                        alt=""
                      />
                    </a>
                    <div className="w-full grow text-sm xs:text-xs lg:text-sm">
                      <a href={`/anime/${item.mal_id}`} className="w-full text-amethyst-smoke-950 dark:text-amethyst-smoke-300 hover-blue-link duration-200">
                        {item.title}
                      </a>
                    </div>
                    <div
                      onMouseEnter={(e) => handleInfoShow(e)}
                      onMouseLeave={(e) => handleInfoHide(e)}
                      className="target absolute top-1/25 right-1/20 rounded-full p-2 hover:cursor-pointer bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-300"
                    >
                      <Info className="stroke-blue-600 dark:stroke-blue-300 pointer-events-none" size={25} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <AnimePopup mouseLeave={(e) => handleInfoHide(e)} ref={targetRef} />
        </div>
      </div>
    </div>
  );
}
