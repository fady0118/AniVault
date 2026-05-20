import { useQueries } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { delay } from "../../utility/utils";
import { Info } from "lucide-react";
import MangaPopup from "./mangaPopup";

export default function RecentManga() {
  const [recent, setRecent] = useState("manga");
  const targetRef = useRef(null);
  const popupDataRef = useRef(null);

  const [recentMangaQ, recentNovelQ, recentManhwaQ] = useQueries({
    queries: [
      {
        queryKey: ["recentMangaData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/manga?type=manga&sfw=true&genres_exclude=9,12&status=publishing&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentMangaData = await res.json();
          const uniqueMangaData = [...new Set(recentMangaData.data.map((elm) => elm.mal_id))].map((id) => recentMangaData.data.find((item) => item.mal_id === id));
          return { ...recentMangaData, uniqueMangaData };
        },
      },
      {
        queryKey: ["recentNovelData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/manga?type=novel&sfw=true&genres_exclude=9,12&status=publishing&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentNovelData = await res.json();
          const uniqueNovelData = [...new Set(recentNovelData.data.map((elm) => elm.mal_id))].map((id) => recentNovelData.data.find((item) => item.mal_id === id));
          return { ...recentNovelData, uniqueNovelData };
        },
      },
      {
        queryKey: ["recentManhwaData"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/manga?type=manhwa&sfw=true&genres_exclude=9,12&status=publishing&order_by=start_date&sort=desc");
          if (!res.ok) throw new Error(res.statusText);
          const recentManhwaData = await res.json();
          const uniqueManhwaData = [...new Set(recentManhwaData.data.map((elm) => elm.mal_id))].map((id) => recentManhwaData.data.find((item) => item.mal_id === id));
          return { ...recentManhwaData, uniqueManhwaData };
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

    if (recent === "manga") {
      popupDataRef.current = recentMangaQ.data.data.find((i) => i.mal_id === Number(e.target.parentElement.dataset.malId));
    } else if (recent === "novel") {
      popupDataRef.current = recentNovelQ.data.data.find((i) => i.mal_id === Number(e.target.parentElement.dataset.malId));
    } else if (recent === "manhwa") {
      popupDataRef.current = recentManhwaQ.data.data.find((i) => i.mal_id === Number(e.target.parentElement.dataset.malId));
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
    element.querySelectorAll("#published>p")[1].textContent = popupDataRef?.current?.published?.string;
    element.querySelectorAll("#status>p")[1].textContent = popupDataRef?.current?.status;
    // genres
    const genresDiv = element.querySelector("#genres>div");
    genresDiv.innerHTML = popupDataRef?.current?.genres?.reduce(
      (c, genre) => c + ` <p class="font-medium text-[0.9em] px-1 rounded-xl border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20">${genre.name}</p>`,
      "",
    );
    // hyperlink
    if (popupDataRef?.current?.mal_id) {
      element.querySelector("#details").href = `/manga/${popupDataRef?.current?.mal_id}`;
    }
  }
  return (
    <div id="recent" className="w-full relative flex flex-col gap-y-3 p-3">
      <div className="w-full flex flex-row flex-wrap justify-between items-center text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase">
        <div className="text-[0.85em]">Recent Manga</div>
        <div id="recentTabs" className="flex flex-row gap-x-2 items-center text-[0.65em]">
          <div
            onClick={() => {
              setRecent("manga");
            }}
            className={`tab ${recent === "manga" ? "active-tab" : ""}`}
          >
            manga
          </div>
          <div
            onClick={() => {
              setRecent("novel");
            }}
            className={`tab ${recent === "novel" ? "active-tab" : ""}`}
          >
            novel
          </div>
          <div
            onClick={() => {
              setRecent("manhwa");
            }}
            className={`tab ${recent === "manhwa" ? "active-tab" : ""}`}
          >
            manhwa
          </div>
        </div>
      </div>
      <div className="w-full max-h-[75vh] grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 overflow-y-scroll overflow-x-clip gap-5">
        {recent === "manga" ? (
          <>
            {recentMangaQ?.data?.uniqueMangaData?.map((item, i) => (
              <div data-mal-id={item.mal_id} key={i} className="wrapper relative flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 hover:-translate-y-1.5 duration-200">
                <a href={`/manga/${item.mal_id}`} className="w-full aspect-3/4 rounded-lg overflow-hidden hover:brightness-75 duration-200">
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
        ) : recent === "novel" ? (
          <>
            {recentNovelQ?.data?.uniqueNovelData?.map((item, i) => (
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
        ) : recent === "manhwa" ? (
          <>
            {recentManhwaQ?.data?.uniqueManhwaData?.map((item, i) => (
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
        ) : (
          ""
        )}
      </div>
      <MangaPopup mouseLeave={(e) => handleInfoHide(e)} ref={targetRef} />
    </div>
  );
}
