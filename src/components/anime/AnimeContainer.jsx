import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { jikanFetch } from "../../utility/jikanApi";

export default function AnimeContainer({ searchParams }) {
  // type & status are enums in the api so we need to seperate them from the other params and fetch in parallel
  const types = useMemo(() => searchParams.get("type"), [searchParams]);
  const statuses = useMemo(() => searchParams.get("status"), [searchParams]);

  const typeList = useMemo(() => (types ? types?.split(",") : [""]), [types]);
  const statusList = useMemo(() => (statuses ? statuses?.split(",") : [""]), [statuses]);
  const rest = useMemo(
    () =>
      new URLSearchParams({
        genres: searchParams.get("genres"),
        genres_exclude: searchParams.get("genres_exclude"),
        q: searchParams.get("q"),
        order_by: searchParams.get("order_by"),
        sort: searchParams.get("sort"),
        min_score: searchParams.get("min_score"),
        max_score: searchParams.get("max_score"),
        rating: searchParams.get("rating"),
        start_date: searchParams.get("start_date"),
        end_date: searchParams.get("end_date"),
      }),
    [searchParams],
  );

  const queries = useQueries({
    queries: typeList.flatMap((type) =>
      statusList.map((status) => ({
        queryKey: ["animeData", rest.toString(), type, status],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/anime?${rest}&type=${type}&status=${status}`);
          if (!res.ok) throw new Error(res.statusText);
          return await res.json();
        },
      })),
    ),
  });
  const isPending = queries.some((q) => q.isPending);
  const uniqueData = [...new Map(queries.flatMap((q) => q.data?.data ?? []).map((item) => [item.mal_id, item])).values()];

  return (
    <div className="relative order-3 px-5 py-1 ">
      {isPending ? (
        <>
          <div className="absolute top-full left-1/2 -translate-1/2">Loading...</div>
        </>
      ) : (
        <>
          <div className="p-2 grid grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
            {uniqueData?.map((item) => (
              <div key={item.mal_id} className="group relative w-full aspect-2/3 rounded-md overflow-hidden flex-col hover:scale-105 hover:cursor-pointer duration-200">
                <a href={`anime/${item.mal_id}`}>
                  <img src={item.images.webp.image_url || item.images.jpg.image_url} alt={item.title} className="w-full h-full object-cover text-2xs group-hover:brightness-65 duration-200" />
                </a>
                <div className="absolute bottom-0 left-0 w-full min-h-15 box-colors-medium translate-y-full group-hover:translate-y-0 duration-200">
                  <div className="w-full h-full flex flex-col p-1.5 gap-y-1 text-3xs">
                    <p className="text-[1.3em] font-bold">{item.title_english || item.title}</p>
                    <div className="flex flex-row items-center flex-wrap">
                      <p className="">{item.status}</p>
                      {item.status.toLowerCase() === "not yet aired" ? <p>&nbsp;-&nbsp;{item.aired.string}</p> : <>{item.score ? <p className="">&nbsp;-&nbsp;{item.score}</p> : ""}</>}
                    </div>
                    {item.themes.length ? (
                      <div className="flex flex-row flex-wrap gap-x-1">
                        {item.genres.map((genres, i) => (
                          <a
                            target="_blank"
                            href={genres.url}
                            key={i}
                            className="font-light rounded-full px-0.5 m-0.5 box-colors-accent hover:cursor-pointer hover-indigo-link duration-200"
                          >
                            {genres.name}
                          </a>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
