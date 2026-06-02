import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import { jikanFetch } from "../../utility/jikanApi";

export default function SearchContainer({ searchInput, category }) {
  useEffect(() => {
    // call the fetch function
    console.log(searchInput);
  }, [searchInput]);

  const [animeSearchQ] = useQueries({
    queries: [
      {
        queryKey: ["animeSearch", searchInput],
        queryFn: async () => {
          if (!searchInput) throw new Error("search term is null");
          const res = await jikanFetch(`https://api.jikan.moe/v4/anime?q=${searchInput}`);
          if (!res.ok) throw new Error(res.statusText);
          const animeData = await res.json();
          return animeData;
        },
        enabled: Boolean(searchInput) && (category === "all" || category === "anime"),
      },
    ],
  });

  return (
    <>
      <div></div>
    </>
  );
}
