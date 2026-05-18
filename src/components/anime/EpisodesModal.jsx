import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { dateFormatter } from "../../utility/utils";

export default function EpisodesModal({ setShowEpisodesModal }) {
  const { id } = useParams();
  const [sortBy, setSortBy] = useState("mal_id"); // mal_id, aired, score
  const [order, setOrder] = useState("ascending"); // ascending, descending

  const sorting = (sortTerm) => {
    if (sortTerm === sortBy) {
      switch (order) {
        case "ascending":
          setOrder("descending");
          break;
        case "descending":
          setOrder("ascending");
          break;
        default:
          setOrder("ascending");
          break;
      }
    } else {
      setOrder("ascending");
      setSortBy(sortTerm);
    }
  };

  const [episodesQ] = useQueries({
    queries: [
      {
        queryKey: ["episodes", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
          if (!res.ok) throw new Error(res.statusText);
          const anime_Data = await res.json();
          return anime_Data;
        },
      },
    ],
  });

  const sortData = useMemo(() => {
    if (!episodesQ?.data) return [];
    let sortedData;
    if (sortBy === "aired") {
      if (order === "ascending") {
        sortedData = [...episodesQ?.data?.data].sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
      } else {
        sortedData = [...episodesQ?.data?.data].sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
      }
    } else {
      if (order === "ascending") {
        sortedData = [...episodesQ?.data?.data].sort((a, b) => a[sortBy] - b[sortBy]);
      } else {
        sortedData = [...episodesQ?.data?.data].sort((a, b) => b[sortBy] - a[sortBy]);
      }
    }
    return sortedData;
  }, [episodesQ.data, sortBy, order]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEpisodesModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <>
      <div className="z-50 flex flex-col rounded-lg fixed top-1/2 left-1/2 transform -translate-1/2 w-6/7 h-6/7 sm:w-3/4 sm:h-4/5 max-w-3xl">
        <div className="flex justify-between items-center p-2">
          <div className="w-full flex flex-row-reverse">
            <button
              onClick={() => {
                setShowEpisodesModal(false);
              }}
              className=" w-fit flex items-center text-xs px-1 rounded-sm border border-amethyst-smoke-800/70 dark:border-amethyst-smoke-500/40  hover:cursor-pointer"
            >
              esc
            </button>
          </div>
        </div>
        <div className="w-full px-4 box-colors overflow-y-scroll rounded-sm">
          <table className=" w-full text-start capitalize text-sm border-spacing-3">
            <thead className="sticky top-0 box-colors backdrop-blur-sm bg-neutral-secondary-soft border-b border-dark-amethyst-smoke-500/20 dark:border-amethyst-smoke-500/20">
              <tr>
                <th className="text-start w-1/20 min-w-8 py-3 font-medium">
                  <div
                    onClick={() => sorting("mal_id")}
                    className="flex flex-row items-center gap-x-0.5 group border-dark-amethyst-smoke-500/50 dark:border-amethyst-smoke-500/50 rounded-sm hover:cursor-pointer hover:border hover:-translate-y-0.5 duration-200"
                  >
                    # {sortBy === "mal_id" ? order === "ascending" ? <ChevronDown size={16} /> : <ChevronUp size={16} /> : "-"}
                  </div>
                </th>
                <th className="text-start py-3 font-medium">Episode Title</th>
                <th className="text-start w-1/10 min-w-15 py-3 font-medium">
                  <div
                    onClick={() => sorting("aired")}
                    className="flex flex-row items-center gap-x-0.5 group border-dark-amethyst-smoke-500/50 dark:border-amethyst-smoke-500/50 rounded-sm hover:cursor-pointer hover:border hover:-translate-y-0.5 duration-200"
                  >
                    Aired {sortBy === "aired" ? order === "ascending" ? <ChevronDown size={16} /> : <ChevronUp size={16} /> : "-"}
                  </div>
                </th>
                <th className="text-start w-1/10 min-w-15 py-3 font-medium">
                  <div
                    onClick={() => sorting("score")}
                    className="flex flex-row items-center gap-x-0.5 group border-dark-amethyst-smoke-500/50 dark:border-amethyst-smoke-500/50 rounded-sm hover:cursor-pointer hover:border hover:-translate-y-0.5 duration-200"
                  >
                    Score {sortBy === "score" ? order === "ascending" ? <ChevronDown size={16} /> : <ChevronUp size={16} /> : "-"}
                  </div>
                </th>
                <th className="text-start w-1/10 min-w-15 py-3 font-medium">type</th>
              </tr>
            </thead>
            <tbody>
              {sortData?.map((ep, i) => (
                <tr key={`${ep.mal_id}-${i}`} className="font-light ">
                  <td className="pt-3">{String(ep.mal_id).padStart(2, "0")}</td>
                  <td className="px-1 pt-3">{ep.title}</td>
                  <td className="px-1 pt-3">{dateFormatter(ep.aired)}</td>
                  <td className="px-1 pt-3">{ep.score || "-"}</td>
                  <td className="pt-3">
                    {ep.filler ? (
                      <div className="text-indigo-500 rounded-sm">filler</div>
                    ) : ep.recap ? (
                      <div className="text-blue-500 rounded-sm">recap</div>
                    ) : (
                      <div className="text-emerald-500 rounded-sm">canon</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="z-40 fixed top-0 w-screen h-screen bg-dark-amethyst-smoke-50/90"></div>
    </>
  );
}
