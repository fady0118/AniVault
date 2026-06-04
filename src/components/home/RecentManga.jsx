import { useQueries } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { delay } from "../../utility/utils";
import { jikanFetch } from "../../utility/jikanApi";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import MangaPopup from "./mangaPopup";
import { Link } from "react-router";
import EmptyDataFallback from "../EmptyDataFallback";
import RecentPlaceHolder from "./RecentPlaceHolder";

export default function RecentManga() {
  const [recent, setRecent] = useState("manga");
  const targetRef = useRef(null);
  const popupDataRef = useRef(null);
  const [mangaCurrentPage, setMangaCurrentPage] = useState(1);
  const [novelCurrentPage, setNovelCurrentPage] = useState(1);
  const [manhwaCurrentPage, setManhwaCurrentPage] = useState(1);

  const [recentMangaQ, recentNovelQ, recentManhwaQ] = useQueries({
    queries: [
      {
        queryKey: ["recentMangaData", mangaCurrentPage],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/manga?type=manga&sfw=true&genres_exclude=9,12,49&status=publishing&order_by=start_date&sort=desc&page=${mangaCurrentPage || 1}`);
          const recentMangaData = await res.json();
          const uniqueMangaData = [...new Map(recentMangaData.data.map((item) => [item.mal_id, item])).values()];
          return { ...recentMangaData, uniqueMangaData };
        },
      },
      {
        queryKey: ["recentNovelData", novelCurrentPage],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/manga?type=novel&sfw=true&genres_exclude=9,12,49&status=publishing&order_by=start_date&sort=desc&page=${novelCurrentPage || 1}`);
          const recentNovelData = await res.json();
          const uniqueNovelData = [...new Map(recentNovelData.data.map((item) => [item.mal_id, item])).values()];
          return { ...recentNovelData, uniqueNovelData };
        },
      },
      {
        queryKey: ["recentManhwaData", manhwaCurrentPage],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/manga?type=manhwa&sfw=true&genres_exclude=9,12,49&status=publishing&order_by=start_date&sort=desc&page=${manhwaCurrentPage || 1}`);
          const recentManhwaData = await res.json();
          const uniqueManhwaData = [...new Map(recentManhwaData.data.map((item) => [item.mal_id, item])).values()];
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
    genresDiv.innerHTML = popupDataRef?.current?.genres?.reduce((c, genre) => c + ` <p class="font-medium text-[0.9em] m-0.5 px-1 rounded-xl border magazine-border-colors">${genre.name}</p>`, "");
    // hyperlink
    if (popupDataRef?.current?.mal_id) {
      element.querySelector("#details").href = `/manga/${popupDataRef?.current?.mal_id}`;
    }
  }

  function swapPage(type) {
    if (recent === "manga") {
      if (type === "next") {
        setMangaCurrentPage((s) => (recentMangaQ?.data?.pagination?.has_next_page ? s + 1 : s));
      } else {
        setMangaCurrentPage((s) => (s > 1 ? s - 1 : 1));
      }
    } else if (recent === "novel") {
      if (type === "next") {
        setNovelCurrentPage((s) => (recentNovelQ?.data?.pagination?.has_next_page ? s + 1 : s));
      } else {
        setNovelCurrentPage((s) => (s > 1 ? s - 1 : 1));
      }
    } else if (recent === "manhwa") {
      if (type === "next") {
        setManhwaCurrentPage((s) => (recentManhwaQ?.data?.pagination?.has_next_page ? s + 1 : s));
      } else {
        setManhwaCurrentPage((s) => (s > 1 ? s - 1 : 1));
      }
    }
  }
  function checkChevron(dir) {
    if (dir === "left") {
      if (recent === "manga") {
        return mangaCurrentPage > 1;
      } else if (recent === "novel") {
        return novelCurrentPage > 1;
      } else if (recent === "manhwa") {
        return manhwaCurrentPage > 1;
      }
    } else if (dir === "right") {
      if (recent === "manga") {
        return recentMangaQ?.data?.pagination?.has_next_page;
      } else if (recent === "novel") {
        return recentNovelQ?.data?.pagination?.has_next_page;
      } else if (recent === "manhwa") {
        return recentManhwaQ?.data?.pagination?.has_next_page;
      }
    }
  }
  return (
    <div id="recent" className="w-full relative flex flex-col gap-y-3 p-3">
      <div className="w-full flex flex-row flex-wrap justify-between items-center text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase">
        <div className="text-[0.85em]">Recent Manga</div>
        <div className="flex flex-row flex-wrap items-center gap-x-5">
          <div id="pagination" className="flex flex-row gap-x-1.5 items-center text-sm">
            <div onClick={() => swapPage("prev")}>
              <ChevronLeft
                className={`${checkChevron("left") ? "stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15" : "stroke-text-light/50 dark:stroke-text-dark/50"} stroke-3 p-2 box-content rounded-full duration-200`}
                size={18}
              />
            </div>
            {recent === "manga" ? <div>{mangaCurrentPage}</div> : recent === "novel" ? <div>{novelCurrentPage}</div> : <div>{manhwaCurrentPage}</div>}
            <div onClick={() => swapPage("next")}>
              <ChevronRight
                className={`${checkChevron("right") ? "stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15" : "stroke-text-light/50 dark:stroke-text-dark/50"} stroke-3 p-2 box-content rounded-full duration-200`}
                size={18}
              />
            </div>
          </div>
          <div id="recentTabs" className="flex flex-row gap-x-2 items-center text-[0.55em] md:text-[0.65em]">
            <div
              onClick={() => {
                setRecent("manga");
              }}
              className={`recentTab ${recent === "manga" ? "active-tab" : ""}`}
            >
              manga
            </div>
            <div
              onClick={() => {
                setRecent("novel");
              }}
              className={`recentTab ${recent === "novel" ? "active-tab" : ""}`}
            >
              novel
            </div>
            <div
              onClick={() => {
                setRecent("manhwa");
              }}
              className={`recentTab ${recent === "manhwa" ? "active-tab" : ""}`}
            >
              manhwa
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-h-[65vh] grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 overflow-y-scroll snap-mandatory overflow-x-clip gap-5">
        {recent === "manga" ? (
          <>
            {recentMangaQ.isPending ? (
              <>
                <RecentPlaceHolder/>
              </>
            ) : recentMangaQ?.data?.uniqueMangaData?.length ? (
              <>
                {recentMangaQ?.data?.uniqueMangaData?.map((item, i) => (
                  <div
                    data-mal-id={item.mal_id}
                    key={i}
                    className="wrapper relative snap-start scroll-m-10 flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 hover:-translate-y-1.5 duration-200"
                  >
                    <Link to={`/manga/${item.mal_id}`} className="w-full aspect-3/4 rounded-lg overflow-hidden hover:brightness-75 duration-200">
                      <img
                        className="w-full h-full object-cover"
                        src={item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.image_url || item.images?.jpg?.image_url}
                        alt=""
                      />
                    </Link>
                    <div className="w-full grow text-sm xs:text-xs lg:text-sm">
                      <Link to={`/anime/${item.mal_id}`} className="w-full cutoff-text-abs max-lines-2 text-amethyst-smoke-950 dark:text-amethyst-smoke-300 hover-blue-link duration-200">
                        {item.title}
                      </Link>
                    </div>
                    <div
                      onMouseEnter={(e) => handleInfoShow(e)}
                      onMouseLeave={(e) => handleInfoHide(e)}
                      className="target absolute top-1/25 right-1/20 rounded-full p-1.5 hover:cursor-pointer bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-300"
                    >
                      <Info className="stroke-indigo-500 dark:stroke-indigo-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <EmptyDataFallback string="no manga data found" />
            )}
          </>
        ) : recent === "novel" ? (
          <>
            {recentNovelQ.isPending ? (
              <>
                <RecentPlaceHolder/>
              </>
            ) : recentNovelQ?.data?.uniqueNovelData?.length ? (
              <>
                {recentNovelQ?.data?.uniqueNovelData?.map((item, i) => (
                  <div
                    data-mal-id={item.mal_id}
                    key={i}
                    className="wrapper relative snap-start scroll-m-10 flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 hover:-translate-y-1.5 duration-200"
                  >
                    <Link to={`/anime/${item.mal_id}`} className="w-full aspect-3/4 rounded-lg overflow-hidden hover:brightness-75 duration-200">
                      <img
                        className="w-full h-full"
                        src={item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.image_url || item.images?.jpg?.image_url}
                        alt=""
                      />
                    </Link>
                    <div className="w-full grow text-sm xs:text-xs lg:text-sm">
                      <Link to={`/anime/${item.mal_id}`} className="w-full cutoff-text-abs max-lines-2 text-amethyst-smoke-950 dark:text-amethyst-smoke-300 hover-blue-link duration-200">
                        {item.title}
                      </Link>
                    </div>
                    <div
                      onMouseEnter={(e) => handleInfoShow(e)}
                      onMouseLeave={(e) => handleInfoHide(e)}
                      className="target absolute top-1/25 right-1/20 rounded-full p-2 hover:cursor-pointer bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-300"
                    >
                      <Info className="stroke-pink-600 dark:stroke-pink-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <EmptyDataFallback string="no novel data found" />
            )}
          </>
        ) : recent === "manhwa" ? (
          <>
            {recentManhwaQ.isPending ? (
              <>
                <RecentPlaceHolder/>
              </>
            ) : recentManhwaQ?.data?.uniqueManhwaData?.length ? (
              <>
                {recentManhwaQ?.data?.uniqueManhwaData?.map((item, i) => (
                  <div
                    data-mal-id={item.mal_id}
                    key={i}
                    className="wrapper relative snap-start scroll-m-10 flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 hover:-translate-y-1.5 duration-200"
                  >
                    <Link to={`/anime/${item.mal_id}`} className="w-full aspect-3/4 rounded-lg overflow-hidden hover:brightness-75 duration-200">
                      <img
                        className="w-full h-full"
                        src={item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.image_url || item.images?.jpg?.image_url}
                        alt=""
                      />
                    </Link>
                    <div className="w-full grow text-sm xs:text-xs lg:text-sm">
                      <Link to={`/anime/${item.mal_id}`} className="w-full cutoff-text-abs max-lines-2 text-amethyst-smoke-950 dark:text-amethyst-smoke-300 hover-blue-link duration-200">
                        {item.title}
                      </Link>
                    </div>
                    <div
                      onMouseEnter={(e) => handleInfoShow(e)}
                      onMouseLeave={(e) => handleInfoHide(e)}
                      className="target absolute top-1/25 right-1/20 rounded-full p-2 hover:cursor-pointer bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-300"
                    >
                      <Info className="stroke-pink-600 dark:stroke-pink-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <EmptyDataFallback string="no manhwa data found" />
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <MangaPopup mouseLeave={(e) => handleInfoHide(e)} ref={targetRef} />
    </div>
  );
}
