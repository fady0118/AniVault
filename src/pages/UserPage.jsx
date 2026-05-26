import { useQueries } from "@tanstack/react-query";
import { useParams } from "react-router";
import { DateTimeFormatter, renderInfoStr } from "../utility/utils";
import { useEffect, useState } from "react";
import CardBox from "../components/CardBox/CardBox";
import FriendsModal from "../components/user/FriendsModal";
import { jikanFetch } from "../utility/jikanApi";

const colors = ["bg-emerald-500", "bg-indigo-500", "bg-amber-500", "bg-rose-500", "bg-gray-500"];

export default function UserPage() {
  const { username } = useParams();
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [userQ, favoritesQ, friendsQ, recommendationsQ] = useQueries({
    queries: [
      {
        queryKey: ["user", username],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/users/${username}/full`);
          if (!res.ok) throw new Error(res.statusText);
          const user_Data = await res.json();
          return user_Data.data || "";
        },
      },
      {
        queryKey: ["userFav", username],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/users/${username}/favorites`);
          if (!res.ok) throw new Error(res.statusText);
          const fav_Data = await res.json();
          const fav_anime_Arr = fav_Data?.data.anime.map((item) => ({ anime: { path: "anime", name: item.title, ...item } })) || [];
          const fav_manga_Arr = fav_Data?.data.manga.map((item) => ({ anime: { path: "manga", name: item.title, ...item } })) || [];
          const fav_character_Arr = fav_Data?.data.characters.map((item) => ({ anime: { path: "characters", ...item } })) || [];
          const fav_people_Arr = fav_Data?.data.people.map((item) => ({ anime: { path: "people", ...item } })) || [];
          return { anime: fav_anime_Arr, manga: fav_manga_Arr, characters: fav_character_Arr, people: fav_people_Arr } || "";
        },
      },
      {
        queryKey: ["friends", username],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/users/${username}/friends`);
          if (!res.ok) throw new Error(res.statusText);
          const friends_Data = await res.json();
          return friends_Data.data || "";
        },
      },
      {
        queryKey: ["recommendations", username],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/users/${username}/recommendations`);
          if (!res.ok) throw new Error(res.statusText);
          const recommendations_Data = await res.json();
          return recommendations_Data;
        },
      },
    ],
  });
  useEffect(() => {
    if (userQ?.data?.about) {
      document.getElementById("aboutText").innerHTML = userQ?.data?.about;
    }
  }, [userQ]);

  function renderStats(data, total, heading) {
    return (
      <div className="flex flex-col py-2 gap-y-2">
        <div className="w-full flex flex-row justify-between">
          {Object.entries(heading).map((d, i) => (
            <div key={i} className="flex flex-row items-center gap-x-2 text-xs capitalize">
              <p>{d[0]}:</p>
              <p>{d[1]}</p>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-row items-center h-3 fill-to-right rounded-sm overflow-hidden">
          {Object.values(data).map((d, i) => (
            <div key={i} style={{ width: `${((100 * d) / total.total_entries).toFixed(1)}%` }} className={`h-full ${colors[i]}`}></div>
          ))}
        </div>
        <div className="w-full grid grid-cols-2 gap-x-5">
          <div className="w-full flex flex-col space-y-2">
            {Object.entries(data).map((d, i) => (
              <div key={i} className="flex flex-row justify-between items-center gap-x-2 text-xs capitalize">
                <div className="flex flex-row items-center gap-x-2">
                  <p className={`w-2 aspect-square rounded-full ${colors[i]}`}></p>
                  <p>{d[0]}:</p>
                </div>
                <p>{d[1]}</p>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-col space-y-2">
            {Object.entries(total).map((d, i) => (
              <div key={i} className="flex flex-row justify-between items-center gap-x-2 text-xs capitalize">
                <p>{d[0]}:</p>
                <p>{d[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  function renderFavorites(data, title) {
    if (!data) return;
    return (
      <div className="px-1 text-sm overflow-clip">
        <p className="capitalize px-2">
          {title} ({data.length})
        </p>
        <CardBox dataArr={data} aspect="2/3" num={10} />
      </div>
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
            <div id="userContent" className="relative order-2 w-full flex flex-col sm:flex-row sm:justify-start gap-3">
              <div className="sm:sticky sm:top-18 flex flex-col gap-y-3 h-fit w-1/4 min-w-48 max-w-64 ">
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
                    {friendsQ?.data?.length ? (
                      <div id="friends" className="w-full">
                        <div className="flex flex-row items-center justify-between border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">
                          <p>friends</p>
                          <p
                            onClick={() => setShowFriendsModal(true)}
                            className="text-xs font-light hover:cursor-pointer border-b border-transparent hover:border-dark-amethyst-smoke-50 dark:hover:border-amethyst-smoke-300"
                          >
                            All ({friendsQ?.data.length})
                          </p>
                        </div>
                        <div className="grid grid-cols-4 p-2 gap-0.5">
                          {friendsQ?.data.slice(0, 11).map((f, i) => (
                            <>
                              <div className="w-full aspect-square hover:">
                                <a href={`/user/${f?.user?.username}`}>
                                  <img
                                    className="w-full h-full object-cover hover:cursor-pointer hover:border-2 hover:border-amethyst-smoke-400/30 duration-100"
                                    src={f?.user?.images.webp.image_url || f?.user?.images.jpg.image_url}
                                    alt=""
                                  />
                                </a>
                              </div>
                            </>
                          ))}
                          <div
                            onClick={() => setShowFriendsModal(true)}
                            className="w-full aspect-square border-2 border-amethyst-smoke-400/10 hover:bg-amethyst-smoke-400/15 hover:cursor-pointer hover:border-amethyst-smoke-400/30 duration-100 flex justify-center items-center"
                          >
                            +{friendsQ?.data?.length - 11}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="w-3/4 grow flex flex-col gap-y-3">
                <div id="about" className="w-fit max-w-full h-fit min-h-32 rounded-lg overflow-hidden box-colors">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">About</div>
                  <div id="aboutText" className="flex flex-col px-3 py-2 text-xs">
                    About section is left empty by the user
                  </div>
                </div>
                <div id="statistics" className="w-full flex flex-col py-2 gap-y-2 rounded-lg overflow-hidden box-colors">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">statistics</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 px-3">
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
                        {
                          "days watched": userQ?.data?.statistics.anime.days_watched,
                          "mean score": userQ?.data?.statistics.anime.mean_score,
                        },
                      )}
                    </div>
                    <div>
                      <div className="border-b border-amethyst-smoke-200/40 pt-0.5 font-semibold text-sm/relaxed capitalize">Manga stats</div>
                      {renderStats(
                        {
                          reading: userQ?.data?.statistics.manga.reading,
                          completed: userQ?.data?.statistics.manga.completed,
                          "on hold": userQ?.data?.statistics.manga.on_hold,
                          dropped: userQ?.data?.statistics.manga.dropped,
                          "plan to read": userQ?.data?.statistics.manga.plan_to_read,
                        },
                        {
                          total_entries: userQ?.data?.statistics.manga.total_entries,
                          reread: userQ?.data?.statistics.manga.reread,
                          "chapters read": userQ?.data?.statistics.manga.chapters_read,
                          "volumes read": userQ?.data?.statistics.manga.volumes_read,
                        },
                        {
                          "days read": userQ?.data?.statistics.manga.days_read,
                          "mean score": userQ?.data?.statistics.manga.mean_score,
                        },
                      )}
                    </div>
                  </div>
                </div>
                {favoritesQ?.data?.anime.length || favoritesQ?.data?.manga.length || favoritesQ?.data?.characters.length || favoritesQ?.data?.people.length ? (
                  <div id="favorites" className="w-full flex flex-col py-2 gap-y-2 rounded-lg overflow-hidden box-colors">
                    <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">favorites</div>
                    {renderFavorites(favoritesQ?.data.anime, "anime")}
                    {renderFavorites(favoritesQ?.data.manga, "manga")}
                    {renderFavorites(favoritesQ?.data.characters, "characters")}
                    {renderFavorites(favoritesQ?.data.people, "people")}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {showFriendsModal ? <FriendsModal data={friendsQ?.data} setShowFriendsModal={setShowFriendsModal} /> : ""}
    </>
  );
}
