import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { jikanFetch } from "../../utility/jikanApi";
import { Leaf, Rose, Snowflake, Sun, SunSnow } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const seasons = [
  { name: "winter", icon: <Sun size={12} /> },
  { name: "spring", icon: <Rose size={12} /> },
  { name: "summer", icon: <Sun size={12} /> },
  { name: "fall", icon: <Leaf size={12} /> },
];
const types = ["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv_special"];
export default function AnimeSeasonPage() {
  // seasons nav checkbox
  const [seasonsCheckBoxValue, setSeasonsCheckBoxValue] = useState(true);
  // destructure current season/year from url
  const { season, year } = useParams();
  // searchParams for filter param
  const [searchParams, setSearchParams] = useSearchParams();
  // types filter state
  const [typesFilter, setTypesFilter] = useState(searchParams.get("filter"));
  // utility for navigating
  const navigate = useNavigate();
  // data fetch
  const queryClient = useQueryClient();
  const seasonQ = useQuery({
    queryKey: ["season", season, year, searchParams],
    queryFn: async () => {
      const res = await jikanFetch(`https://api.jikan.moe/v4/seasons/${year}/${season}?filter=${searchParams.get("filter") || ""}`);
      const { pagination, data } = await res.json();
      return { pagination, data: [...new Map(data.map((item) => [item.mal_id, item])).values()] };
    },
  });

  function changeFilter(val) {
    setTypesFilter((prevState) => (prevState === val ? "" : val));
    setSearchParams((prevState) => {
      return prevState.get("filter") === val ? { filter: "" } : { filter: val };
    });
  }
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["season", season, year, searchParams], exact: true });
  }, [searchParams]);
  return (
    <>
      {seasonQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3 text-2xs sm:text-xs">
            <div className="w-[95vw] flex flex-col ">
              <div id="heading" className="order-1 mt-3 capitalize font-semibold text-[1.5em]">
                {season} {year}
              </div>
              <div id="filtering" className="order-2 flex flex-col gap-2 py-2">
                <div id="seasons" className="flex flex-row items-center gap-3 text-[1.25em]">
                  <label
                    className="peer flex flex-row items-center gap-1 capitalize box-border px-1 py-0.5 rounded-sm box-colors hover:cursor-pointer border-2 border-transparent hover:border-dark-amethyst-smoke-50/20 dark:hover:border-amethyst-smoke-50/20 duration-200"
                    htmlFor="seasons nav"
                  >
                    <SunSnow size={15} /> seasons
                    <input
                      type="checkbox"
                      name="seasons nav"
                      id="seasons nav"
                      hidden
                      checked={seasonsCheckBoxValue}
                      onChange={() => {
                        setSeasonsCheckBoxValue((s) => !s);
                      }}
                    />
                  </label>
                  <div className="hidden peer-has-checked:flex flex-row flex-wrap gap-x-2.5 gap-y-1 items-center overflow-hidden">
                    {seasons.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          navigate(`/anime/seasons/${year}/${s.name}?filter=${typesFilter}`);
                        }}
                        className={`capitalize text-[0.8em] flex flex-row items-center gap-1 px-1.5 py-0.5 rounded-sm hover:cursor-pointer duration-200 slide-in-from-left ${s.name === season.toLowerCase().trim() ? "blue-link box-colors" : "hover-blue-link hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-200/75"}`}
                      >
                        {s.icon}
                        <p>
                          {s.name} {year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1">
                  <div id="types" className="flex flex-row items-center gap-x-1">
                    {types.map((type, i) => (
                      <div
                        key={i}
                        className={`capitalize px-1 py-0.5 rounded-sm hover:cursor-pointer duration-200 slide-in-from-left ${type === typesFilter ? "blue-link box-colors" : "hover-blue-link hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-200/75"}`}
                        onClick={() => {
                          changeFilter(type);
                        }}
                      >
                        {type.split("_").join(" ")}
                      </div>
                    ))}
                  </div>
                  <div id="pagination"></div>
                </div>
              </div>
              {seasonQ?.data?.data?.length ? (
                <div id="animeContainer" className="order-last">
                  {seasonQ?.data?.data.map((item) => (
                    <div key={item.mal_id}>{item.title}</div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
