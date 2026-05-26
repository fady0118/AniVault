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
          {uniqueData?.map((item) => (
            <div key={item.mal_id}>{item.title}</div>
          ))}
        </>
      )}
    </div>
  );
}
