import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Search } from "lucide-react";
import { dateFormatter } from "../../utility/utils";

export default function EpisodesModal({ setShowEpisodesModal }) {
  const { id } = useParams();

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
      {episodesQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="z-50 flex flex-col rounded-lg fixed top-1/2 left-1/2 transform -translate-1/2 w-5/6 h-6/7 sm:w-3/4 sm:h-4/5 max-w-2xl">
            <div className="flex justify-between items-center p-2">
              <div className="w-full flex flex-row-reverse">
                <button
                  onClick={() => {
                    console.log("esc clicked");
                    setShowEpisodesModal(false);
                  }}
                  className=" w-fit flex items-center text-xs px-1 rounded-sm border border-amethyst-smoke-800/70 dark:border-amethyst-smoke-500/40  hover:cursor-pointer"
                >
                  esc
                </button>
              </div>
            </div>
            <div className="px-4 box-colors overflow-y-scroll rounded-sm">
              <table className=" w-full text-start capitalize text-sm ">
                <thead className="sticky top-0 box-colors backdrop-blur-sm bg-neutral-secondary-soft border-b border-dark-amethyst-smoke-500/20 dark:border-amethyst-smoke-500/20">
                  <tr>
                    <th className="text-start py-3 font-medium">#</th>
                    <th className="text-start py-3 font-medium">Episode Title</th>
                    <th className="text-start py-3 font-medium">Aired</th>
                    <th className="text-start py-3 font-medium">Score</th>
                    <th className="text-start py-3 font-medium">type</th>
                  </tr>
                </thead>
                <tbody>
                  {episodesQ?.data?.data?.map((ep, i) => (
                    <tr>
                      <td className="py-1">{i}</td>
                      <td className="py-1">{ep.title}</td>
                      <td className="py-1">{dateFormatter(ep.aired)}</td>
                      <td className="py-1">{ep.score || "-"}</td>
                      <td className="py-1">
                        {ep.filler ? <div className="p-1 bg-indigo-800/50 rounded-sm">filler</div> : ep.recap ? <div className="p-1 bg-blue-800/50 rounded-sm">recap</div> : <div className="p-1 bg-emerald-800/50 rounded-sm">canon</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="z-40 fixed top-0 w-screen h-screen bg-dark-amethyst-smoke-50/90"></div>
        </>
      )}
    </>
  );
}

{
  /* 
      
      {episodesQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center min-h-screen pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
          <div className="w-[95vw] flex flex-col space-y-3 "></div>
        </div>
      )}
      */
}
