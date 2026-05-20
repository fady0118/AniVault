import { useQueries } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { delay } from "../../utility/utils";
import AnimePopup from "./AnimePopup";
import { Info } from "lucide-react";

export default function RecentAnime() {
  const [recent, setRecent] = useState("tv");
  const targetRef = useRef(null);
  const popupDataRef = useRef(null);

  const [recentTvQ, recentMovieQ] = useQueries({
    queries: [
      {
        queryKey: ["recentTvData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=tv&sfw=true&genres_exclude=9,12&status=airing&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentTvData = await res.json();
          const uniqueTvData = [...new Set(recentTvData.data.map((elm) => elm.mal_id))].map((id) => recentTvData.data.find((item) => item.mal_id === id));
          return { ...recentTvData, uniqueTvData };
        },
      },
      {
        queryKey: ["recentMovieData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=movie&sfw=true&genres_exclude=9,12&status=complete&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentMovieData = await res.json();
          const uniqueMovieData = [...new Set(recentMovieData.data.map((elm) => elm.mal_id))].map((id) => recentMovieData.data.find((item) => item.mal_id === id));
          return { ...recentMovieData, uniqueMovieData };
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
    // position
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
    // data
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
    // genres
    const genresDiv = element.querySelector("#genres>div");
    genresDiv.innerHTML = popupDataRef?.current?.genres?.reduce(
      (c, genre) => c + ` <p class="font-medium text-[0.9em] m-0.5 px-1 rounded-xl border magazine-border-colors">${genre.name}</p>`,
      "",
    );
    // hyperlink
    if (popupDataRef?.current?.mal_id) {
      element.querySelector("#details").href = `/anime/${popupDataRef?.current?.mal_id}`;
    }
  }
  return (
    <div id="recent" className="w-full relative flex flex-col gap-y-3 p-3">
      <div className="w-full flex flex-row flex-wrap justify-between items-center text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase">
        <div className="text-[0.85em]">Recent Anime</div>
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
      <div className="w-full max-h-[75vh] grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 overflow-y-scroll overflow-x-clip gap-5">
        {recent === "tv" ? (
          <>
            {recentTvQ?.data?.uniqueTvData?.map((item, i) => (
              <div data-mal-id={item.mal_id} key={i} className="wrapper relative flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 hover:-translate-y-1.5 duration-200">
                <a href={`/anime/${item.mal_id}`} className="w-full aspect-3/4 rounded-lg overflow-hidden hover:brightness-75 duration-200">
                  <img
                    className="w-full h-full object-cover"
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
                  <img className="w-full h-full" src={item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.image_url || item.images?.jpg?.image_url} alt="" />
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
  );
}
