import { useQueries } from "@tanstack/react-query";
import { useParams } from "react-router";
import { DateTimeFormatter, renderInfoStr } from "../utility/utils";
import { useEffect } from "react";

const colors = ["bg-emerald-500", "bg-indigo-500", "bg-amber-500", "bg-rose-500", "bg-gray-500"];

export default function UserPage() {
  const { username } = useParams();
  const [userQ] = useQueries({
    queries: [
      {
        queryKey: ["user", username],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/users/${username}/full`);
          const user_Data = await res.json();
          return user_Data.data || "";
        },
      },
    ],
  });
  useEffect(() => {
    if (userQ?.data?.about) {
      document.getElementById("aboutText").innerHTML = userQ?.data?.about;
    }
  }, [userQ]);

  function renderStats(data, total) {
    return (
      <>
        <div className="w-full flex flex-row items-center h-4 fill-to-right">
          {Object.values(data).map((d, i) => (
            <div style={{ width: `${((100 * d) / total.total_entries).toFixed(1)}%` }} className={`h-full ${colors[i]}`}></div>
          ))}
        </div>
        <div className="w-full grid grid-cols-2 p-2">
          <div className="w-full flex flex-col space-y-2">
            {Object.entries(data).map((d, i) => (
              <div className="flex flex-row items-center gap-x-2 text-xs capitalize">
                <p className={`w-2 aspect-square rounded-full ${colors[i]}`}></p>
                <p>{d[0]}:</p>
                <p>{d[1]}</p>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-col space-y-2">
            {Object.entries(total).map((d, i) => (
              <div className="flex flex-row items-center gap-x-2 text-xs capitalize">
                <p>{d[0]}:</p>
                <p>{d[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {userQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
            <div id="title" className="order-1 mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex items-center space-x-2">
              <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{userQ?.data.username}'s Profile</div>
              <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={userQ?.data.url} target="_blank">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                  alt="MyAnimeList Logo"
                  className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                />
              </a>
            </div>
            <div id="userContent" className="order-2 w-full flex flex-col sm:flex-row sm:justify-start gap-3">
              <div className="flex flex-col gap-y-3 w-1/4 min-w-48 max-w-64 ">
                <div id="image" className="order-1">
                  <img className="w-full aspect-square object-cover rounded-lg overflow-hidden" src={userQ?.data.images.webp.image_url || userQ?.data.images.jpg.image_url} alt="" />
                </div>
                <div className="order-2 w-full flex flex-col md:flex-row gap-3">
                  <div className="w-full flex flex-col justify-between h-fit gap-y-2 md:gap-y-8 rounded-lg box-colors">
                    <div id="information" className="w-full">
                      <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">information</div>
                      <div className="px-3 py-2 text-xs font-light">
                        <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                          {renderInfoStr("last online", `${DateTimeFormatter(userQ?.data?.last_online)}`)}
                          {userQ?.data?.birthday ? renderInfoStr("birthday", `${userQ?.data?.birthday}`) : ""}
                          {userQ?.data?.location ? renderInfoStr("location", `${userQ?.data?.location}`) : ""}
                          {userQ?.data?.gender ? renderInfoStr("gender", `${userQ?.data?.gender}`) : ""}
                          {userQ?.data?.joined ? renderInfoStr("joined", `${DateTimeFormatter(userQ?.data?.joined)}`) : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-y-3">
                <div id="about" className="w-fit h-fit min-h-32 rounded-lg overflow-hidden box-colors">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">About</div>
                  <div id="aboutText" className="flex flex-col px-3 py-2 text-xs"></div>
                </div>
                <div id="statistics" className="w-full rounded-lg overflow-hidden box-colors">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">statistics</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 px-3 py-2">
                    <div>
                      <div className="border-b border-amethyst-smoke-200/40 pt-0.5 font-semibold text-sm/relaxed capitalize">ِAnime stats</div>
                      {renderStats(
                        {
                          watching: userQ?.data?.statistics.anime.watching,
                          completed: userQ?.data?.statistics.anime.completed,
                          "on hold": userQ?.data?.statistics.anime.on_hold,
                          dropped: userQ?.data?.statistics.anime.dropped,
                          "plan to watch": userQ?.data?.statistics.anime.plan_to_watch,
                        },
                        {
                          total_entries: userQ?.data?.statistics.anime.total_entries,
                          rewatched: userQ?.data?.statistics.anime.rewatched,
                          "episodes watched": userQ?.data?.statistics.anime.episodes_watched,
                        },
                      )}
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
