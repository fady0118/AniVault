import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Character from "../components/CardBox/Box";
import CharacterCardBox from "../components/CardBox/CharacterCardBox";
import { WindowContext } from "../App";
import { ChevronRight, LinkIcon, Music4Icon, Star } from "lucide-react";

export default function AnimePage() {
  let { id } = useParams();
  const [animeData, setanimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relationsImgs, setRelationsImgs] = useState([]);
  const [showAllRelations, setShowAllRelations] = useState(false);
  const { windowWidth } = useContext(WindowContext);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const [resAnime, resCharacters, resReviews] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${id}/full`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/characters`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`),
        ]);
        const [anime_Data, characters_Data, reviews_Data] = await Promise.all([resAnime.json(), resCharacters.json(), resReviews.json()]);
        console.log(reviews_Data.status);
        setanimeData({
          ...anime_Data.data,
          characters: characters_Data.data,
          reviews:
            reviews_Data.status === 500
              ? null
              : {
                  data: reviews_Data.data,
                  stats: {
                    all: reviews_Data.data.length,
                    recommended: reviews_Data.data.reduce((c, r) => (r.tags.some((t) => t.toLowerCase() == "recommended") ? c + 1 : c), 0),
                    mixedFeelings: reviews_Data.data.reduce((c, r) => (r.tags.some((t) => t.toLowerCase() == "mixed feelings") ? c + 1 : c), 0),
                    notRecommended: reviews_Data.data.reduce((c, r) => (r.tags.some((t) => t.toLowerCase() == "not recommended") ? c + 1 : c), 0),
                    avgScore: reviews_Data.data.reduce((c, r) => c + r.score, 0) / reviews_Data.data.length,
                  },
                },
          flattenedRelations: anime_Data.data.relations.flatMap(({ relation, entry }) => entry.map((item) => ({ ...item, relation }))),
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnime();
  }, [id]);

  useEffect(() => {
    console.log(animeData);
  }, [animeData]);

  const dataArr = animeData?.characters.map(({ role, character, voice_actors }) => ({
    character: { path: "character", role, ...character },
    voice_actor: { path: "people", ...voice_actors.find((actor) => actor.language === "Japanese")?.person },
  }));

  const relationsImgsRef = useRef(relationsImgs);
  const fetchedBeforeRef = useRef(false);
  const getImage = async ({ mal_id, type }) => {
    const res = await fetch(`https://api.jikan.moe/v4/${type}/${mal_id}`);
    const { data } = await res.json();
    return {
      mal_id,
      image: data?.images.jpg.large_image_url,
    };
  };

  async function fetchRelations(startIndex, lastIndex) {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    for (const entry of animeData.flattenedRelations.slice(startIndex, lastIndex)) {
      await delay(350);
      const image = await getImage(entry);
      setRelationsImgs((s) => [...s, { ...entry, ...image }]);
    }
  }
  useEffect(() => {
    if (!animeData || fetchedBeforeRef.current) return;
    fetchRelations(0, 6);
    return () => (fetchedBeforeRef.current = true);
  }, [animeData]);

  function renderInfoArr(title, arr) {
    return (
      <div className="w-full flex flex-row gap-x-1 items-start capitalize">
        <p className="font-semibold ">{title}:</p>
        <p className="flex flex-row flex-wrap">
          {arr.length
            ? arr.map((item, i, arr) => (
                <span key={i} className="whitespace-pre-wrap">
                  {item.name}
                  {i !== arr.length - 1 ? ", " : ""}
                </span>
              ))
            : "None found."}
        </p>
      </div>
    );
  }

  function renderInfoStr(title, str) {
    return (
      <div className="w-full flex flex-row gap-x-1 items-start capitalize">
        <p className="font-semibold ">{title}:</p>
        <p>{str}</p>
      </div>
    );
  }

  function renderIcon(name) {
    switch (name) {
      case "YouTube":
        return <img alt="YouTube icon" className="h-3" src="https://cdn.myanimelist.net/img/common/external_links/102.png" />;
      case "AniDB":
        return <img className="h-3" alt="AniDB icon" src="https://cdn.myanimelist.net/img/common/external_links/200.png" />;
      case "ANN":
        return <img className="h-3" alt="ANN icon" src="https://cdn.myanimelist.net/img/common/external_links/201.png" />;
      case "Wikipedia":
        return <img className="h-3" alt="Wikipedia icon" src="https://cdn.myanimelist.net/img/common/external_links/202.png" />;
      case "Syoboi":
        return <img className="h-3" alt="Syoboi icon" src="https://cdn.myanimelist.net/img/common/external_links/203.png" />;
      case "Netflix":
        return (
          <img
            className="h-3"
            alt="Crunchyroll icon"
            src="https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
          />
        );
      case "Crunchyroll":
        return <img className="h-3" alt="Crunchyroll icon" src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/crunchyroll.png" />;
      default:
        return name.startsWith("@") ? <img className="h-3" alt="twitter icon" src="https://cdn.myanimelist.net/img/common/external_links/101.png" /> : <LinkIcon size={12} />;
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center min-h-screen pt-15 text-dark-amethyst-smoke-50 dark:text-text-dark">
            <div className="w-[95vw] flex flex-col space-y-3 ">
              <div id="title" className="order-1 mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex flex-col">
                <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{animeData?.title}</div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65">{animeData?.title_english}</span>
                  <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={animeData?.url} target="_blank">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                      alt="MyAnimeList Logo"
                      className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                    />
                  </a>
                </div>
              </div>
              <div className="order-2 flex flex-col w-full gap-y-3">
                <div className="w-full order-1 flex flex-col gap-3">
                  <div className="flex flex-col xs:flex-row items-stretch gap-3 w-full">
                    <div className="w-1/6 min-w-28 2xs:min-w-36 aspect-2/3 rounded-lg box-colors order-1 overflow-hidden self-auto shrink-0">
                      <div id="poster" className="w-full h-full">
                        <img className="h-full w-full object-cover rounded-lg overflow-hidden" src={animeData?.images.jpg.large_image_url} alt={animeData?.title} />
                      </div>
                    </div>
                    <div className="order-1 flex flex-col gap-3">
                      <div id="details" className="box-colors rounded-lg w-fit">
                        <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Details</div>
                        <div className="p-2 flex flex-row flex-wrap gap-2 text-4xs sm:text-3xs">
                          <div className="flex flex-col justify-between pr-2 items-center border-r border-amethyst-smoke-500/20 ">
                            <p className="text-text-dark text-[1.4em] font-medium px-2.5 bg-mal-blue rounded-xs uppercase">Score</p>
                            <p className="text-[1.8em]/snug font-semibold">{animeData?.score}</p>
                            <p className="font-light text-[1.25em]">{animeData?.scored_by.toLocaleString()} users</p>
                          </div>
                          <div className="grid grid-cols-3 grid-rows-3 items-end gap-x-3  2xs:gap-x-6 md:gap-x-8 lg:gap-x-10 capitalize ">
                            <div className="row-span-2 flex flex-col">
                              <p className="text-[1.8em]">Ranked</p>
                              <p className="text-[1.4em]">#{animeData?.rank}</p>
                            </div>
                            <div className="row-span-2 flex flex-col">
                              <p className="text-[1.8em]">Popularity</p>
                              <p className="text-[1.4em]">#{animeData?.popularity}</p>
                            </div>
                            <div className="row-span-2 flex flex-col">
                              <p className="text-[1.8em]">Members</p>
                              <p className="text-[1.4em]">{animeData?.members.toLocaleString()}</p>
                            </div>
                            <p className="flex flex-row text-[1.2em]">
                              {animeData?.season} {animeData?.year}
                            </p>
                            <p className="text-[1.2em]">{animeData.type}</p>
                            <div className="flex flex-row space-x-1.5 flex-wrap text-[1.2em]">
                              {animeData?.studios.map((studio, i) => (
                                <p key={i}>{studio.name}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {windowWidth > 480 ? (
                        <div className="w-full rounded-lg box-colors order-2 overflow-hidden">
                          <div id="background">
                            <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">background</div>
                            <div className="flex flex-col px-3 py-2">
                              <div className="peer">
                                <input type="checkbox" name="background-text-checkbox" id="background-text-checkbox" className="hidden" />
                              </div>
                              <p className="text-xs font-light max-lines-3 cutoff-text min-h-8">{animeData?.background || "No background found."}</p>
                              {animeData?.background ? (
                                <label
                                  htmlFor="background-text-checkbox"
                                  className="w-full text-right text-xs capitalize hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300 before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                ></label>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {windowWidth <= 480 ? (
                    <div className="w-full py-2 rounded-lg box-colors order-2 overflow-hidden">
                      <div id="background">
                        <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">background</div>
                        <div className="flex flex-col px-3 py-2">
                          <div className="peer">
                            <input type="checkbox" name="background-text-checkbox" id="background-text-checkbox" className="hidden" />
                          </div>
                          <p className="text-xs font-light max-lines-4 cutoff-text min-h-8">{animeData?.background || "No background found."}</p>
                          {animeData?.background ? (
                            <label
                              htmlFor="background-text-checkbox"
                              className="w-full text-right text-xs capitalize hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300 before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                            ></label>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {/* @todo only show see more if there's more lines  */}
                {/* @todo find alternative source for not found background */}

                <div className="order-2 w-full flex flex-col md:flex-row gap-3">
                  <div className="w-fit md:w-1/4 max-w-sm flex flex-col justify-between h-fit gap-y-8 rounded-lg box-colors">
                    <div id="information" className="w-full">
                      <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">information</div>
                      <div className="px-3 py-2 text-xs font-light">
                        <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                          {renderInfoStr("type", `${animeData.type}`)}
                          {renderInfoStr("episodes", `${animeData.episodes ?? "unknown"}`)}
                          {renderInfoStr("status", `${animeData.status}`)}
                          {renderInfoStr("aired", `${animeData.aired.string}`)}
                          {renderInfoStr("premiered", `${animeData.season} ${animeData.year}`)}
                          {renderInfoStr("broadcast", `${animeData.broadcast.string}`)}
                          {renderInfoArr("producers", animeData.producers)}
                          {renderInfoArr("licensors", animeData.licensors)}
                          {renderInfoArr("studios", animeData.studios)}
                          {renderInfoStr("source", `${animeData.source}`)}
                          {renderInfoArr("genres", animeData.genres)}
                          {renderInfoArr("themes", animeData.themes)}
                          {renderInfoArr("demographics", animeData.demographics)}
                          {renderInfoStr("duration", `${animeData.duration}`)}
                          {renderInfoStr("rating", `${animeData.rating}`)}
                        </div>
                      </div>
                    </div>
                    <div id="statistics" className="w-full">
                      <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">statistics</div>
                      <div className="px-3 py-2 text-xs font-light">
                        <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                          {renderInfoStr("score", `${animeData.score} (scored by ${animeData.scored_by.toLocaleString()} users) `)}
                          {renderInfoStr("ranked", `#${animeData.rank}`)}
                          {renderInfoStr("popularity", `#${animeData.popularity}`)}
                          {renderInfoStr("members", `${animeData.members.toLocaleString()}`)}
                          {renderInfoStr("favorites", `${animeData.favorites.toLocaleString()}`)}
                        </div>
                      </div>
                    </div>
                    <div id="external" className="w-full">
                      <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Available At</div>
                      <div className="px-3 py-2 text-xs font-light">
                        <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                          {animeData.external.map((ext, i) => (
                            <p className="flex flex-row items-center gap-1.5" key={i}>
                              {renderIcon(ext.name)}
                              <a className="blue-link" href={ext.url}>
                                {ext.name}
                              </a>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div id="streaming" className="w-ful">
                      <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Streaming Platforms</div>
                      <div className="flex flex-col gap-y-2.5 px-3 py-2 text-xs font-light">
                        {animeData.streaming.map((stream, i) => (
                          <div className="flex flex-row gap-x-2 items-center" key={i}>
                            {renderIcon(stream.name)}
                            <a className="blue-link" href={stream.url}>
                              {stream.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-3/4 flex flex-col md:flex-row flex-wrap gap-3 h-fit">
                    <div className="flex flex-col md:flex-row gap-3 w-full">
                      {animeData?.trailer.embed_url && (
                        <div id="trailer" className="rounded-lg box-colors overflow-hidden w-full md:w-1/2 order-2 md:order-1">
                          <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed">Watch Trailer</div>
                          <div className="w-full aspect-video">
                            <iframe
                              className="w-full h-full"
                              src={animeData?.trailer.embed_url.split("&autoplay")[0]}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                      <div className="w-fit md:w-1/2 h-fit rounded-lg box-colors overflow-hidden order-1 md:order-2">
                        <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">titles</div>
                        <div className="flex flex-col gap-y-1 px-3 py-2 text-xs font-light">
                          {animeData.titles
                            // .filter((title) => title.type !== "Default")
                            .map((title, i) => (
                              <div key={i} className="flex flex-row space-x-1 w-full">
                                <p className="font-semibold min-w-16">{title.type}: </p>
                                <p>{title.title}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div id="synopsis" className="rounded-lg box-colors h-fit w-full">
                      <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">synopsis</div>
                      <div className="flex flex-col space-y-1.5 px-3 py-2 items-end">
                        <div className="peer">
                          <input className="hidden " type="checkbox" name="synopsisCheckbox" id="synopsisCheckbox" />
                        </div>
                        <p className="w-full text-xs font-light overflow-hidden max-lines-4 cutoff-text">{animeData?.synopsis || "synopsis missing.."}</p>
                        {animeData?.synopsis ? (
                          <label
                            htmlFor="synopsisCheckbox"
                            className="text-xs capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                          ></label>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div id="characters" className="flex justify-center w-full h-fit">
                      <div className="rounded-lg box-colors w-full ">
                        <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Characters & Voice Actors</div>
                        <CharacterCardBox dataArr={dataArr} />
                      </div>
                    </div>

                    <div id="relations" className="flex justify-center w-full h-fit text-2xs lg:text-xs">
                      <div className="rounded-lg box-colors w-full ">
                        <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Related Entries</div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 auto-rows-fr gap-y-2 p-2">
                          {animeData.flattenedRelations.slice(0, 6).map((entry, i) => (
                            <div key={i} className="flex flex-row w-full">
                              <a className="w-1/4 max-w-14 h-full aspect-2/3 " href={entry.url}>
                                <img className="w-full h-full object-cover" src={relationsImgs?.find((r) => r.mal_id === entry.mal_id)?.image ?? null} alt={entry.name} />
                              </a>
                              <div className="w-3/4 flex flex-col gap-y-1 px-2">
                                <a href={entry.url} className="text-blue-800 dark:text-blue-400">
                                  {entry.name}
                                </a>
                                <p>
                                  {entry.relation} ({entry.type})
                                </p>
                              </div>
                            </div>
                          ))}
                          {!showAllRelations && animeData.flattenedRelations.length > 6 ? (
                            <div
                              onClick={() => {
                                setShowAllRelations(true);
                                fetchRelations(6, animeData.flattenedRelations.length);
                              }}
                              className="flex flex-row justify-center items-center w-full text-2xl border-4 border-amethyst-smoke-400/30 hover:cursor-pointer hover:bg-amethyst-smoke-400/20"
                            >
                              +{animeData.flattenedRelations.length - 6}
                            </div>
                          ) : (
                            ""
                          )}
                          {showAllRelations
                            ? animeData.flattenedRelations.slice(6).map((entry, i) => (
                                <div key={i} className="flex flex-row w-full">
                                  <a className="w-1/4 max-w-14 h-full aspect-2/3 " href={entry.url}>
                                    <img className="w-full h-full object-cover" src={relationsImgs?.find((r) => r.mal_id === entry.mal_id)?.image ?? null} alt={entry.name} />
                                  </a>
                                  <div className="w-3/4 flex flex-col gap-y-1 px-2">
                                    <a href={entry.url} className="text-blue-800 dark:text-blue-400">
                                      {entry.name}
                                    </a>
                                    <p>
                                      {entry.relation} ({entry.type})
                                    </p>
                                  </div>
                                </div>
                              ))
                            : ""}
                        </div>
                      </div>
                    </div>
                    {/* @todo replace entry link from mal link to own app link after writing the manga route  */}

                    {animeData.theme.openings.length || animeData.theme.endings.length ? (
                      <div id="theme" className="flex justify-center w-full h-fit text-2xs lg:text-[11px]">
                        <div className="rounded-lg box-colors w-full grid grid-cols-2 gap-4 py-1">
                          {animeData.theme.openings.length ? (
                            <div id="openings">
                              <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">openings</div>
                              <div className="flex flex-col w-full gap-y-2 p-2">
                                {animeData.theme.openings.map((opening, i) => (
                                  <div key={i} className="w-full flex flex-row items-center gap-x-2">
                                    <Music4Icon className="w-[10%]" size={16} />
                                    <p className="w-[90%]">{opening}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {animeData.theme.endings.length ? (
                            <div id="endings">
                              <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">endings</div>
                              <div className="flex flex-col w-full gap-y-2 p-2">
                                {animeData.theme.endings.map((ending, i) => (
                                  <div key={i} className="w-full flex flex-row items-center gap-x-2">
                                    <Music4Icon className="w-[10%]" size={16} />
                                    <p className="w-[90%]">{ending}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div id="reviews" className="order-3 rounded-lg box-colors w-full py-1">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">reviews</div>
                  {animeData.reviews ? (
                    <div className="flex flex-col w-full text-xs/normal gap-y-2 p-2">
                      <div className="flex flex-row justify-between ">
                        <div className="flex flex-row items-center gap-x-1 py-1 px-3 bg-amethyst-smoke-700/30 text-2xs">
                          <p>Avg Score</p>
                          <p className="">{animeData.reviews.stats.avgScore}</p>
                          <Star size={14} color="yellow" />
                        </div>
                        <div className="flex flex-col py-1 px-2 bg-amethyst-smoke-700/30">
                          <div className="flex flex-row flex-wrap items-center gap-x-3 rounded-sm text-2xs">
                            <div className="flex flex-row items-center capitalize gap-x-1 text-blue-800 dark:text-blue-400">
                              <Star size={12} className="stroke-blue-800 dark:stroke-blue-400" />
                              <p>{animeData.reviews.stats.recommended}</p>
                              <p>recommended</p>
                            </div>
                            <div className="flex flex-row items-center capitalize gap-x-1 text-gray-800 dark:text-gray-400">
                              <Star size={12} className="stroke-gray-800 dark:stroke-gray-400" />
                              <p>{animeData.reviews.stats.mixedFeelings}</p>
                              <p>mixed feelings</p>
                            </div>
                            <div className="flex flex-row items-center capitalize gap-x-1 text-rose-800 dark:text-rose-400">
                              <Star size={12} className="stroke-rose-800 dark:stroke-rose-400" />
                              <p>{animeData.reviews.stats.notRecommended}</p>
                              <p>not recommended</p>
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundImage: `linear-gradient(90deg, var(--color-blue-400) ${((animeData.reviews.stats.recommended - 1.5) * 100) / animeData.reviews.stats.all}%, var(--color-gray-400) ${((animeData.reviews.stats.recommended + 1.5) * 100) / animeData.reviews.stats.all}%, var(--color-gray-400) ${((animeData.reviews.stats.recommended + animeData.reviews.stats.mixedFeelings - 1.5) * 100) / animeData.reviews.stats.all}%, var(--color-rose-400) ${((animeData.reviews.stats.recommended + animeData.reviews.stats.mixedFeelings + 1.5) * 100) / animeData.reviews.stats.all}%)`,
                            }}
                            className="h-1 w-full px-3"
                          ></div>
                        </div>
                        <div className="flex flex-row gap-x-1 text-2xs">
                          <ChevronRight size={12} />
                          <p>All reviews ({animeData.reviews.stats.all})</p>
                        </div>
                      </div>
                      {animeData.reviews.data.map((review) => (
                        <div key={review.mal_id}>
                          <div className="flex flex-col"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col w-full text-xs/normal p-4">
                      <p>No reviews found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full overflow-hidden">
              <img className="w-full h-full aspect-auto object-cover blur-lg scale-105 brightness-35 bg-repeat-y" src={animeData?.images.jpg.large_image_url} alt={animeData?.title} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
