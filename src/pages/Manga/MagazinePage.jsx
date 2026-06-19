import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { RootContext } from "../../App";
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Hash, LucideLayoutGrid, LucideLayoutList, Star, User } from "lucide-react";
import { getSeason, getYear } from "../../utility/utils";
import LoaderComponent from "../../components/LoaderComponent";

const classes = {
  gridClasses: {
    grid: "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-fr ",
    tiles: "grid grid-cols-1 auto-rows-fr ",
  },
};

export default function MagazinePage() {
  let { id } = useParams();
  const { windowWidth } = useContext(RootContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("grid"); // grid, tiles

  const currentPage = Number(searchParams.get("page") ?? 1);
  const letterFilter = searchParams.get("letter") || "";

  const pageSwap = (newPage) => {
    const letter = searchParams.get("letter") || "";
    setSearchParams({ page: newPage, letter });
  };
  const filterByLetter = (letter) => {
    setSearchParams({ letter });
  };

  const magazineQ = useQuery({
    queryKey: ["magazine", id, currentPage, letterFilter],
    queryFn: async () => {
      const res = await fetch(`https://api.jikan.moe/v4/manga?magazines=${id}&page=${currentPage}&letter=${letterFilter}`);
      if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
      const magazine_Data = await res.json();
      return magazine_Data;
    },
  });

  function currentPageChange(type) {
    if (type == "increment") {
      if (magazineQ?.data?.pagination?.has_next_page) {
        pageSwap(currentPage + 1);
      }
    } else if (type == "decrement") {
      if (currentPage > 1) {
        pageSwap(currentPage - 1);
      }
    }
  }
  useEffect(() => {
    if (currentPage > magazineQ?.data?.pagination?.last_visible_page) pageSwap(magazineQ?.data?.pagination?.last_visible_page);
  }, [magazineQ]);

  return (
    <>
      {magazineQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2"><LoaderComponent /></div>
      ) : (
        <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3">
          <div className="w-[95vw] flex flex-col space-y-3">
            {magazineQ?.data?.data?.length ? (
              <div id="title" className="order-1 mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex flex-row gap-x-1.5 items-center">
                <span className="text-sm/relaxed sm:text-lg/relaxed font-bold">{magazineQ?.data?.data[0]?.serializations[0]?.name}</span>
                <Link className="w-7 sm:w-9 rounded-sm overflow-hidden" to={magazineQ?.data?.data[0]?.serializations[0]?.url} target="_blank">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                    alt="MyAnimeList Logo"
                    className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                  />
                </Link>
              </div>
            ) : (
              ""
            )}

            <div className="order-2 w-full flex flex-col box-colors rounded-md px-3 py-2">
              <div className="w-full flex flex-row  flex-wrap justify-between items-center bottom-border text-2xs md:text-xs lg:text-sm capitalize">
                <div className="flex flex-row flex-wrap">
                  {Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).map((l) => (
                    <div
                      onClick={() => {
                        filterByLetter(l);
                      }}
                      key={l}
                      className={`px-1 duration-200 hover:cursor-pointer letter-filter-hover ${letterFilter===l?"active-letter-filter":""}`}
                    >
                      {l}
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      filterByLetter("");
                    }}
                    className={`px-1 duration-200 hover:cursor-pointer letter-filter-hover ${letterFilter===""?"active-letter-filter":""}`}
                  >
                    #
                  </div>
                </div>
                <div id="page" className="flex flex-row justify-between flex-wrap w-fit gap-x-5 text-md/relaxed">
                  <div className="flex flex-row gap-x-1 items-center">
                    <ChevronLeft
                      onClick={() => currentPageChange("decrement")}
                      size={18}
                      className={`${currentPage === 1 ? "stroke-text-light/50 dark:stroke-text-dark/50" : "stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15"} stroke-3 p-2 box-content rounded-full duration-200`}
                    />
                    <p>{currentPage}</p>
                    <ChevronRight
                      onClick={() => currentPageChange("increment")}
                      size={18}
                      className={`${!magazineQ?.data?.pagination?.has_next_page ? "stroke-text-light/50 dark:stroke-text-dark/50" : "stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15"} stroke-3 p-2 box-content rounded-full duration-200`}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-x-0.5">
                    <div>
                      <LucideLayoutGrid
                        onClick={() => {
                          setLayout("grid");
                        }}
                        size={18}
                        className={`layout-icon ${layout === "grid" ? "active-layout-icon" : ""}`}
                      />
                    </div>
                    <div>
                      <LucideLayoutList
                        onClick={() => {
                          setLayout("tiles");
                        }}
                        size={18}
                        className={`layout-icon ${layout === "tiles" ? "active-layout-icon" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`w-full text-2xs gap-x-3 gap-y-3 py-3 ${classes.gridClasses[layout]}`}>
                {magazineQ?.data?.data?.map((manga) => (
                  <div key={manga.mal_id}>
                    {layout === "grid" ? (
                      <div className="w-full h-full flex flex-col capitalize rounded-md overflow-hidden theme-bg-colors">
                        <div className="flex flex-col grow-0 items-center justify-center text-center py-1.5 border-b magazine-border-colors">
                          <Link to={`/manga/${manga.mal_id}`} className="font-bold text-[1.25em] blue-link hover:cursor-pointer">
                            {manga.title_english || manga.title}
                          </Link>
                          <p className="text-[0.9em] font-light">{manga.title_japanese}</p>
                        </div>
                        <div className="flex flex-row flex-wrap justify-center w-full items-center capitalize border-b magazine-border-colors">
                          <div className="flex flex-row gap-x-1.5 py-1.5 justify-center items-center h-full w-1/3 border-r magazine-border-colors">
                            <Calendar size={13} />
                            <p>{getSeason(manga.published.from)},</p>
                            <p>{getYear(manga.published.from)}</p>
                          </div>

                          <div className="flex flex-row gap-x-1.5 py-1.5 justify-center items-center h-full w-1/3  border-r magazine-border-colors">
                            <div className={`w-1.5 aspect-square rounded-full ${manga.publishing ? "bg-green-500" : "bg-dark-amethyst-smoke-50/75 dark:bg-amethyst-smoke-200/75"}`}></div>
                            <p className={`${manga.publishing ? "text-green-500" : ""}`}>{manga.publishing ? "publishing" : "finished"}</p>
                          </div>
                          <div className="flex flex-row gap-x-1.5 py-1.5 justify-center items-center h-full w-1/3">
                            <BookOpen size={13} />
                            <span>
                              {manga.volumes ?? "?"} vols · {manga.chapters ?? "?"} chs
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row justify-evenly items-center py-1.5">
                          {manga.genres.slice(0, 4).map((genre, i) => (
                            <Link target="_blank" key={i} to={genre.url} className="hover-blue-link duration-150">
                              {genre.name}
                            </Link>
                          ))}
                        </div>
                        <div className="w-full flex flex-row items-start grow px-1.5">
                          <div id="poster" className="w-1/2 md:w-2/5">
                            <Link to={`/manga/${manga.mal_id}`}>
                              <img className="w-full h-full aspect-auto object-cover hover:brightness-60 duration-200" src={`${manga.images.jpg.image_url}`} alt={manga.title_english || manga.title} />
                            </Link>
                          </div>
                          <div className="w-1/2 md:w-3/5 flex flex-col gap-y-2 pl-2 pt-2">
                            <div className="w-full flex flex-col order-1 gap-y-0.5">
                              <div className="flex flex-row flex-wrap gap-x-1.5">
                                <p className="font-semibold">Authors</p>
                                <div className="flex flex-row flex-wrap gap-x-0 5">
                                  {manga.authors.map((author, i, arr) => (
                                    <p key={i}>
                                      <Link className="blue-link" to={`/${author.type}/${author.mal_id}`}>
                                        {author.name}
                                      </Link>
                                      <span className="mr-1.5">{i < arr.length - 1 ? "," : ""}</span>
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-row items-center flex-wrap gap-x-1.5">
                                <p className="font-semibold">Themes</p>
                                <div className="flex flex-row flex-wrap gap-x-1">
                                  {manga.themes.length
                                    ? manga.themes.map((theme, i) => (
                                        <Link target="_blank" to={theme.url} key={i} className="font-light rounded-full px-1.5 py-0.5 border magazine-border-colors hover-blue-link hover:cursor-pointer duration-200">
                                          {theme.name}
                                        </Link>
                                      ))
                                    : "-"}
                                </div>
                              </div>

                              <div className="flex flex-row flex-wrap gap-x-1.5">
                                <p className="font-semibold">demographics</p>
                                <div className="flex flex-row flex-wrap gap-x-1">
                                  {manga.demographics.length
                                    ? manga.demographics.map((demographic, i) => (
                                        <p key={i} className="font-light">
                                          {demographic.name}
                                        </p>
                                      ))
                                    : "-"}
                                </div>
                              </div>
                            </div>
                            <div className="overflow-y-scroll grow w-full max-h-25 order-2">
                              <div className="flex flex-col gap-y-1.5 items-end">
                                <div className="peer">
                                  <input className="hidden" type="checkbox" name={`synopsisCheckbox-${manga.mal_id}`} id={`synopsisCheckbox-${manga.mal_id}`} />
                                </div>
                                <p className="w-full h-fullfont-light max-lines-4 cutoff-text">{manga.synopsis || "synopsis missing.."}</p>
                                {manga.synopsis ? (
                                  <label
                                    htmlFor={`synopsisCheckbox-${manga.mal_id}`}
                                    className="capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                  ></label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-evenly items-center capitalize border-t magazine-border-colors">
                          <div className="flex flex-row gap-x-1 py-1.5 w-1/3 justify-center items-center border-r magazine-border-colors">
                            <Star size={14} />
                            <p>{manga.score || "?"}</p>
                          </div>
                          <div className="flex flex-row gap-x-1 py-1.5 w-1/3 justify-center items-center border-r magazine-border-colors">
                            <User size={14} />
                            <p>{manga.members?.toLocaleString() || "?"}</p>
                          </div>
                          <div className="flex flex-row gap-x-1 py-1.5 w-1/3 justify-center items-center">
                            <Hash size={14} />
                            <p>{manga.rank?.toLocaleString() || "?"}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col rounded-md overflow-hidden theme-bg-colors">
                        <div className="flex flex-row grow">
                          <Link to={`/manga/${manga.mal_id}`} className="w-1/8 min-w-20 max-w-36 aspect-auto">
                            <img src={manga.images.jpg.image_url} alt={manga.title_english || manga.title} className="w-full object-cover  hover:brightness-60 duration-200" />
                          </Link>

                          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                            <div className="flex flex-wrap items-center px-3 py-1.5 gap-x-2.5 gap-y-0.5 border-b magazine-border-colors">
                              <Link to={`/manga/${manga.mal_id}`} className="text-[1.25em] font-medium blue-link hover:underline leading-snug truncate">
                                {manga.title_english || manga.title}
                              </Link>
                              <span className="text-[1em] text-text-light/50 dark:text-text-dark-50 font-normal whitespace-pre-wrap">{manga.title_japanese}</span>
                            </div>

                            <div className="px-3 overflow-y-scroll w-full max-h-25">
                              <div className="flex flex-col gap-y-1.5 items-end">
                                <div className="peer">
                                  <input className="hidden" type="checkbox" name={`synopsisCheckbox-${manga.mal_id}`} id={`synopsisCheckbox-${manga.mal_id}`} />
                                </div>
                                <p className="w-full h-full text-[1em] font-light max-lines-4 cutoff-text">{manga.synopsis || "synopsis missing.."}</p>
                                {manga.synopsis ? (
                                  <label
                                    htmlFor={`synopsisCheckbox-${manga.mal_id}`}
                                    className="text-[1em] capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                  ></label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 my-0.5 px-3 text-[0.75em] sm:text-[1em]">
                              {manga.genres.slice(0, 4).map((genre, i) => (
                                <Link target="_blank" key={i} to={genre.url} className="font-light rounded-full px-1.5 py-0.5 border magazine-border-colors hover-blue-link hover:cursor-pointer duration-200">
                                  {genre.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center border-t magazine-border-colors text-[0.75em] sm:text-[1em]">
                          <div className="flex flex-row flex-wrap gap-x-1 px-3.5 justify-center items-center h-full border-r magazine-border-colors">
                            <Calendar className="scale-75 sm:scale-100" size={13} />
                            <p>{getSeason(manga.published.from)},</p>
                            <p>{getYear(manga.published.from)}</p>
                          </div>

                          <div className="flex items-center gap-1.5 px-3.5 py-1.5 border-r magazine-border-colors shrink-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${manga.publishing ? "bg-green-500" : "bg-dark-amethyst-smoke-300/65  dark:bg-amethyst-smoke-400/65"}`} />
                            <span className={`${manga.publishing ? "text-green-500" : ""}`}>{manga.publishing ? "Publishing" : "Finished"}</span>
                          </div>

                          <div className="flex items-center gap-1 px-3.5 py-1.5 border-r magazine-border-colors shrink-0">
                            <BookOpen className="scale-75 sm:scale-100" size={13} />
                            <span>
                              {manga.volumes ?? "?"} vols · {manga.chapters ?? "?"} chs
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5 px-3.5 py-1.5 ml-auto shrink-0">
                            <div className="flex items-center gap-1">
                              <Star className="scale-75 sm:scale-100" size={13} />
                              <span className="font-medium">{manga.score}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="scale-75 sm:scale-100" size={13} />
                              <span>{manga.members.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Hash className="scale-75 sm:scale-100" size={13} className="" />
                              <span>{manga.rank.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
