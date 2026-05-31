import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { jikanFetch } from "../../utility/jikanApi";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export default function MagazineContainer({ searchParams }) {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      order_by: searchParams.get("order_by") || "",
      sort: searchParams.get("sort") || "",
    }),
    [searchParams],
  );
  const magazinesQ = useQuery({
    queryKey: ["magazines", params],
    queryFn: async () => {
      const res = await jikanFetch(`https://api.jikan.moe/v4/magazines?q=${params.q}&order_by=${params.order_by}&sort=${params.sort}&page=${currentPage}`);
      const data = await res.json();
      return data;
    },
  });
  return (
    <div className="relative order-3 px-3 py-1 min-h-32">
      {magazinesQ.isPending ? (
        <>
          <div className="absolute top-full left-1/2 -translate-1/2">Loading...</div>
        </>
      ) : (
        <div className="text-xs p-2 grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
          {magazinesQ?.data?.data?.map((item) => (
            <Link
              key={item.mal_id}
              to={`/manga/magazine/${item.mal_id}`}
              className="p-2 flex flex-row items-center capitalize indigo-link hover:bg-amethyst-smoke-400/45 hover:dark:bg-dark-amethyst-smoke-200/45 border-b magazine-border-colors duration-200"
            >
              <ChevronRight size={13}/> <p>{item.name} ({item.count})</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
