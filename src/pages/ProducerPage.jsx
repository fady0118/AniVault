import { useContext, useState } from "react";
import { useParams } from "react-router";
import { WindowContext } from "../App";
import { useQueries } from "@tanstack/react-query";
import { dateFormatter } from "../utility/utils";
import { Grid3x2, LucideLayoutGrid, LucideLayoutList } from "lucide-react";

export default function ProducerPage() {
  const { id } = useParams();
  const { windowWidth } = useContext(WindowContext);
  const [layout, setLayout] = useState("smallGrid"); // smallGrid, detailedGrid, tiles

  const [producerQ, animesQ] = useQueries({
    queries: [
      {
        queryKey: ["producer", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/producers/${id}/full`);
          const producer_Data = await res.json();
          return producer_Data.data || [];
        },
      },
      {
        queryKey: ["animes", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/anime?producers=${id}`);
          const animes_Data = await res.json();
          return animes_Data || [];
        },
      },
    ],
  });
  return (
    <>
      {producerQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
            <div id="title" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex items-center space-x-2">
              <div className="flex flex-row gap-x-2 text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">
                <p>{producerQ?.data.titles.find((t) => t.type.toLowerCase() === "default").title}</p>
              </div>
              <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={producerQ?.data.url} target="_blank">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                  alt="MyAnimeList Logo"
                  className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                />
              </a>
            </div>
            <div className="w-full order-2 flex flex-col sm:justify-start gap-3">
              <div className="w-full flex flex-row gap-x-3 flex-wrap">
                <div id="image" className="w-1/5 min-w-24 max-w-48 ">
                  <img className="w-full aspect-square object-cover order-1 rounded-lg overflow-hidden" src={producerQ?.data.images.jpg.image_url} alt="" />
                </div>
                <div id="info" className="flex flex-col grow rounded-md box-colors h-fit">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">About</div>
                  <div className="p-3 text-xs font-light whitespace-pre-wrap">{producerQ?.data.about ? producerQ?.data.about : "No biography written."}</div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex flex-col text-xs font-light box-colors rounded-md">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Details</div>
                  <div className="flex flex-col p-2 gap-y-2">
                    <div className="flex flex-row flex-wrap gap-x-3 capitalize">
                      <p className="font-semibold">Japanese:</p>
                      <p>{producerQ?.data.titles.find((t) => t.type.toLowerCase() === "japanese").title || ""}</p>
                    </div>
                    <div className="flex flex-row flex-wrap gap-x-3 capitalize">
                      <p className="font-semibold">established:</p>
                      <p>{dateFormatter(producerQ?.data.established) || ""}</p>
                    </div>
                    <div className="flex flex-row flex-wrap gap-x-3 capitalize">
                      <p className="font-semibold">Member Favorites:</p>
                      <p>{producerQ?.data.favorites || ""}</p>
                    </div>
                  </div>
                </div>

                <div id="anime" className="flex flex-col grow box-colors rounded-md">
                  <div className="flex flex-row justify-between border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">
                    <span>animeography</span>
                    <div id="controls" className="flex flex-row">
                      <div id="layoutControls" className="flex flex-row gap-x-0.5">
                        <div>
                          <Grid3x2
                            onClick={() => {
                              setLayout("smallGrid");
                            }}
                            size={18}
                            className="p-1 box-content hover:cursor-pointer hover:bg-dark-amethyst-smoke-200/30 dark:hover:bg-amethyst-smoke-300/30"
                          />
                        </div>
                        <div>
                          <LucideLayoutGrid
                            onClick={() => {
                              setLayout("detailedGrid");
                            }}
                            size={18}
                            className="p-1 box-content hover:cursor-pointer hover:bg-dark-amethyst-smoke-200/30 dark:hover:bg-amethyst-smoke-300/30"
                          />
                        </div>

                        <div>
                          <LucideLayoutList
                            onClick={() => {
                              setLayout("tiles");
                            }}
                            size={18}
                            className="p-1 box-content hover:cursor-pointer hover:bg-dark-amethyst-smoke-200/30 dark:hover:bg-amethyst-smoke-300/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
