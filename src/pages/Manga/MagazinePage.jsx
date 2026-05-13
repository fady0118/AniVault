import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import { WindowContext } from "../../App";
import { Hash, LucideLayoutGrid, LucideLayoutList, Medal, Star, User } from "lucide-react";
import { getSeason, getYear } from "../../utility/utils";

export default function MagazinePage() {
  let { id } = useParams();
  const { windowWidth } = useContext(WindowContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [letter, setLetter] = useState("");
  const [layout, setLayout] = useState("grid");

  const magazineQ = useQuery({
    queryKey: ["magazine", id, currentPage, letter],
    queryFn: async () => {
      const res = await fetch(`https://api.jikan.moe/v4/manga?magazines=${id}&page=${currentPage}&letter=${letter}`);
      if (!res.ok) throw new Error(res.statusText);
      const magazine_Data = await res.json();
      return magazine_Data;
    },
  });

  return (
    <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
      <div className="w-[95vw] flex flex-col space-y-3">
        <div id="title" className="order-1 mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex flex-row gap-x-1.5 items-center">
          <span className="text-sm/relaxed sm:text-lg/relaxed font-bold">{magazineQ?.data?.data[0]?.serializations[0]?.name}</span>
          <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={magazineQ?.data?.data[0]?.serializations[0]?.url} target="_blank">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
              alt="MyAnimeList Logo"
              className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
            />
          </a>
        </div>

        <div id="pages" className="order-2 w-full flex flex-col box-colors rounded-md px-3 py-2">
          <div className="w-full flex flex-row flex-wrap justify-between items-center bottom-border text-2xs md:text-xs lg:text-sm capitalize">
            <div className="flex flex-row flex-wrap">
              {Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).map((l) => (
                <div
                  onClick={() => {
                    setLetter(l);
                  }}
                  key={l}
                  className="px-1 hover:cursor-pointer hover:bg-dark-amethyst-smoke-200/30 dark:hover:bg-amethyst-smoke-300/30"
                >
                  {l}
                </div>
              ))}
              <div
                onClick={() => {
                  setLetter("");
                }}
                className="px-1 hover:cursor-pointer hover:bg-dark-amethyst-smoke-200/30 dark:hover:bg-amethyst-smoke-300/30"
              >
                #
              </div>
            </div>
            <div className="flex flex-row gap-x-1">
              <div>
                <LucideLayoutGrid
                  onClick={() => {
                    setLayout("grid");
                  }}
                  size={16}
                  className="p-1 box-content hover:cursor-pointer hover:bg-dark-amethyst-smoke-200/30 dark:hover:bg-amethyst-smoke-300/30"
                />
              </div>
              <div>
                <LucideLayoutList
                  onClick={() => {
                    setLayout("tiles");
                  }}
                  size={16}
                  className="p-1 box-content hover:cursor-pointer hover:bg-dark-amethyst-smoke-200/30 dark:hover:bg-amethyst-smoke-300/30"
                />
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-fr text-2xs gap-3 py-3">
            {magazineQ?.data?.data?.map((manga) => (
              <div className="flex flex-col p-2 capitalize rounded-sm border border-amethyst-smoke-950/40 dark:border-amethyst-smoke-200/40">
                <div className="flex flex-col grow items-center justify-center text-center">
                  <a href={`/${manga.type || "manga"}/${manga.mal_id}`} className="font-bold text-[1.25em] blue-link hover:cursor-pointer">
                    {manga.title_english || manga.title}
                  </a>
                  <p className="text-[0.9em] font-light">{manga.title_japanese}</p>
                </div>
                <div className="flex flex-row justify-evenly items-center overflow-x-hidden capitalize py-1 bg-dark-amethyst-smoke-500/5 dark:bg-amethyst-smoke-500/5">
                  <div className="flex flex-row gap-x-1">
                    <p>{getSeason(manga.published.from)},</p>
                    <p>{getYear(manga.published.from)}</p>
                  </div>
                  <p className={`${manga.publishing ? "text-green-500" : ""}`}>{manga.publishing ? "publishing" : "finished"}</p>
                  <div className="flex flex-row gap-x-1">
                    <div className="flex flex-row gap-x-0.5">
                      <p>{manga.volumes || "?"}</p>
                      <p>vols,</p>
                    </div>
                    <div className="flex flex-row gap-x-0.5">
                      <p>{manga.chapters || "?"}</p>
                      <p>chs</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-evenly items-center overflow-x-hidden  py-1 bg-dark-amethyst-smoke-500/10 dark:bg-amethyst-smoke-500/10">
                  {manga.genres.slice(0, 4).map((genre) => (
                    <a href={genre.url} className="hover-blue-link duration-150">
                      {genre.name}
                    </a>
                  ))}
                </div>
                <div className="w-full flex flex-row items-start">
                  <div id="poster" className="w-1/2 md:w-2/5">
                    <a href={`/${manga.type || "manga"}/${manga.mal_id}`}>
                      <img className="w-full h-full aspect-auto object-cover" src={`${manga.images.jpg.image_url}`} alt={manga.title_english || manga.title} />
                    </a>
                  </div>
                  <div className="w-1/2 md:w-3/5 flex flex-col gap-y-2 pl-2 pt-2">
                    <div className="w-full flex flex-col order-1 gap-y-0.5">
                      <div className="flex flex-row flex-wrap gap-x-1.5">
                        <p className="font-semibold">Authors</p>
                        <div className="flex flex-row flex-wrap gap-x-0 5">
                          {manga.authors.map((author, i, arr) => (
                            <p key={i}>
                              <a className="blue-link" href={`/${author.type}/${author.mal_id}`}>
                                {author.name}
                              </a>
                              <span className="mr-1.5">{i < arr.length - 1 ? "," : ""}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap gap-x-1.5">
                        <p className="font-semibold">Themes</p>
                        <div className="flex flex-row flex-wrap gap-x-0 5">{manga.themes.length ? manga.themes.map((theme) => <p className="font-light">{theme.name}</p>) : "-"}</div>
                      </div>

                      <div className="flex flex-row flex-wrap gap-x-1.5">
                        <p className="font-semibold">demographics</p>
                        <div className="flex flex-row flex-wrap gap-x-0 5">
                          {manga.demographics.length ? manga.demographics.map((demographic) => <p className="font-light">{demographic.name}</p>) : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="overflow-y-scroll w-full max-h-25 order-2">
                      <div className="flex flex-col space-y-1.5 items-end h-full">
                        <div className="peer">
                          <input className="hidden" type="checkbox" name={`synopsisCheckbox-${manga.mal_id}`} id={`synopsisCheckbox-${manga.mal_id}`} />
                        </div>
                        <p className="w-full h-full text-xs font-light overflow-hidden max-lines-4 cutoff-text">{manga.synopsis || "synopsis missing.."}</p>
                        {manga.synopsis ? (
                          <label
                            htmlFor={`synopsisCheckbox-${manga.mal_id}`}
                            className="text-xs capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                          ></label>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-evenly items-center overflow-x-hidden pt-2 capitalize text-xs">
                  <div className="flex flex-row gap-x-1 items-center">
                    <Star size={14} />
                    <p>{manga.score}</p>
                  </div>
                  <div className="flex flex-row gap-x-1 items-center">
                    <User size={14} />
                    <p>{manga.members.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-row gap-x-1 items-center">
                    <Hash size={14} />
                    <p>{manga.rank.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
