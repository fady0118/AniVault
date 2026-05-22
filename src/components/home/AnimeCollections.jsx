import { useQueries } from "@tanstack/react-query";
const classes = {
  collectionClass: "w-full flex flex-col rounded-lg overflow-hidden bg-linear-0 from-0% from-amethyst-smoke-300/15 dark:from-dark-amethyst-smoke-50/15 to-100% to-indigo-600/5",
  gradient: [
    "bg-dark-amethyst-smoke-600/21",
    "bg-dark-amethyst-smoke-600/18",
    "bg-dark-amethyst-smoke-600/15",
    "bg-dark-amethyst-smoke-600/12",
    "bg-dark-amethyst-smoke-600/9",
    "bg-dark-amethyst-smoke-600/6",
    "bg-dark-amethyst-smoke-600/3",
    "bg-dark-amethyst-smoke-600/0",
  ],
};
export default function AnimeCollections() {
  const [topAnimeQ, upcomingAnimeQ] = useQueries({
    queries: [
      {
        queryKey: ["topAnime"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=tv&status=complete&order_by=score&sort=desc&limit=13");
          if (!res.ok) throw new Error(res.statusText);
          const topAnimeData = await res.json();
          const uniqueTopAnimeData = [...new Set(topAnimeData.data.map((elm) => elm.mal_id))].slice(0, 7).map((id) => topAnimeData.data.find((item) => item.mal_id === id));
          return uniqueTopAnimeData;
        },
        retry: 3,
        retryDelay: 3000,
      },
      {
        queryKey: ["upcomingAnime"],
        queryFn: async () => {
          const res = await fetch("https://api.jikan.moe/v4/anime?type=tv&status=upcoming&order_by=start_date&sort=desc&limit=13");
          if (!res.ok) throw new Error(res.statusText);
          const upcomingAnimeData = await res.json();
          const uniqueUpcomingAnimeData = [...new Set(upcomingAnimeData.data.map((elm) => elm.mal_id))].slice(0, 7).map((id) => upcomingAnimeData.data.find((item) => item.mal_id === id));
          return uniqueUpcomingAnimeData;
        },
        retry: 3,
        retryDelay: 2000,
      },
    ],
  });
  return (
    <>
      <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 gap-x-6 px-5 w-full lg:w-9/10 capitalize text-sm sm:text-md md:text-lg">
        <div id="top" className="w-full flex flex-col py-1 gap-y-1">
          <p className="uppercase font-extrabold">top anime</p>
          <div className={`${classes.collectionClass}`}>
            {topAnimeQ.isPending ? (
              <div className="h-64 text-text-light-50 dark:text-text-dark-50 py-3 text-center capitalize">Loading...</div>
            ) : (
              <>
                {topAnimeQ?.data?.map((anime, i) => (
                  <a
                    href={`/anime/${anime.mal_id}`}
                    key={i}
                    className={`group w-full px-3 py-2.5 flex flex-row items-center justify-start gap-x-3 text-[0.85em] hover:bg-indigo-300/10 duration-200 ${classes.gradient[i] || classes.gradient[classes.gradient.length]}`}
                  >
                    <img className="rounded-full aspect-square object-cover w-1/9 max-w-17 min-w-12" src={anime?.images?.webp?.image_url || anime?.images?.jpg?.image_url || ""} alt={anime?.title} />
                    <p className="group-hover:text-blue-600/80 dark:group-hover:text-blue-300/80 duration-200">{anime?.title}</p>
                  </a>
                ))}
              </>
            )}
          </div>
        </div>
        <div id="upcoming" className="w-full flex flex-col py-1 gap-y-1">
          <p className="uppercase font-extrabold">upcoming anime</p>
          <div className={`${classes.collectionClass}`}>
            {topAnimeQ.isPending ? (
              <div className="h-64 text-text-light-50 dark:text-text-dark-50 py-3 text-center capitalize">Loading...</div>
            ) : (
              <>
                {upcomingAnimeQ?.data?.map((anime, i) => (
                  <a
                    href={`/anime/${anime.mal_id}`}
                    key={i}
                    className={`group w-full px-3 py-2.5 flex flex-row items-center justify-start gap-x-3 text-[0.85em] hover:bg-indigo-300/10 duration-200 ${classes.gradient[i] || classes.gradient[classes.gradient.length]}`}
                  >
                    <img className="rounded-full aspect-square object-cover w-1/9 max-w-17 min-w-12" src={anime?.images?.webp?.image_url || anime?.images?.jpg?.image_url || ""} alt={anime?.title} />
                    <p className="group-hover:text-blue-600/80 dark:group-hover:text-blue-300/80 duration-200">{anime?.title}</p>
                  </a>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
