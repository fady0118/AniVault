import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Character from "../components/CardBox/Box";
import CardBox from "../components/CardBox/CardBox";
import { WindowContext } from "../App";
import { ChevronRight, Music4Icon, Star } from "lucide-react";
import { renderInfoStr, renderInfoArr, renderIcon, delay, dateFormatter, renderReactions } from "../utility/utils";
import { useRelations } from "../utility/useRelations";
import useGallery from "../utility/useGallery";
import Pictures from "../components/character/Pictures";
import Gallery from "../components/character/Gallery";
import { useQueries } from "@tanstack/react-query";

export default function AnimePage() {
  let { id } = useParams();
  const { windowWidth } = useContext(WindowContext);

  const results = useQueries({
    queries: [
      {
        queryKey: ["anime", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
          if (!res.ok) throw new Error(res.statusText);
          const anime_Data = await res.json();
          const flattenedRelations = anime_Data.data?.relations.flatMap(({ relation, entry }) => entry.map((item) => ({ ...item, relation }))) ?? [];
          return { ...anime_Data.data, flattenedRelations };
        },
      },
      {
        queryKey: ["characters", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
          if (!res.ok) throw new Error(res.statusText);
          const characters_Data = await res.json();
          // charactersCardBox data array
          const dataArr = characters_Data?.data?.map(({ role, character, voice_actors }) => ({
            character: { path: "character", role, ...character },
            voice_actor: { path: "people", ...voice_actors.find((actor) => actor.language === "Japanese")?.person },
          }));
          return { ...characters_Data.data, dataArr };
        },
      },
      {
        queryKey: ["reviews", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`);
          if (!res.ok) throw new Error(res.statusText);
          const reviews_Data = await res.json();
          const allReviews = reviews_Data?.data ?? [];
          const featured = [
            allReviews?.find((r) => r.tags.some((tag) => tag.toLowerCase() === "recommended")),
            allReviews?.find((r) => r.tags.some((tag) => tag.toLowerCase() === "mixed feelings")),
            allReviews?.find((r) => r.tags.some((tag) => tag.toLowerCase() === "not recommended")),
          ].filter(Boolean);
          const rest = allReviews?.filter((r) => !featured.map((f) => f.mal_id).includes(r.mal_id));
          return {
            ...reviews_Data,
            featured,
            rest,
            stats: {
              all: allReviews.length,
              recommended: allReviews.reduce((c, r) => (r.tags.some((t) => t.toLowerCase() == "recommended") ? c + 1 : c), 0),
              mixedFeelings: allReviews.reduce((c, r) => (r.tags.some((t) => t.toLowerCase() == "mixed feelings") ? c + 1 : c), 0),
              notRecommended: allReviews.reduce((c, r) => (r.tags.some((t) => t.toLowerCase() == "not recommended") ? c + 1 : c), 0),
              avgScore: allReviews.reduce((c, r) => c + r.score, 0) / reviews_Data.data?.length,
            },
          };
        },
      },
      {
        queryKey: ["pictures", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/pictures`);
          if (!res.ok) throw new Error(res.statusText);
          const pictures_Data = await res.json();
          return pictures_Data.data || [];
        },
      },
      {
        queryKey: ["recommendations", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
          if (!res.ok) throw new Error(res.statusText);
          const recommendations_Data = await res.json();
          // recommendationsDataArr data array
          const recommendationsDataArr = recommendations_Data?.data?.map((recommendation) => ({
            anime: { path: "anime", ...recommendation.entry, name: recommendation.entry.title, votes: recommendation.votes },
          }));
          return { recommendations: recommendations_Data.data, recommendationsDataArr };
        },
      },
    ],
  });

  const [animeQ, charactersQ, reviewsQ, picturesQ, recommendationsQ] = results;
  const isError = results.some((q) => q.isError);

  // Gallery section
  const { dispatch, showModal, openGallery, closeGallery, activeIndex } = useGallery(picturesQ?.data);
  // Relations section
  const { relationsImgs, showAllRelations, setShowAllRelations } = useRelations(animeQ?.data);

  return (
    <>
      {animeQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center min-h-screen pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
            <div className="w-[95vw] flex flex-col space-y-3 ">
              <div id="title" className="order-1 mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex flex-col">
                <div className="text-sm/relaxed sm:text-lg/relaxed font-bold">{animeQ?.data?.title}</div>
                <div className="flex items-center space-x-2.5 text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65">
                  <span>{animeQ?.data.title_english}</span>
                  <span>{animeQ?.data.title_japanese}</span>
                  <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={animeQ?.data?.url} target="_blank">
                    <img
                      src="https:upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
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
                        <img className="h-full w-full object-cover rounded-lg overflow-hidden" src={animeQ?.data?.images.jpg.large_image_url} alt={animeQ?.data?.title} />
                      </div>
                    </div>
                    <div className="order-1 flex flex-col gap-3">
                      <div id="details" className="box-colors rounded-lg w-fit">
                        <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Details</div>
                        <div className="p-2 flex flex-row flex-wrap gap-2 text-4xs sm:text-3xs lg:text-2xs">
                          <div className="flex flex-col justify-evenly pr-2 items-center border-r border-amethyst-smoke-500/20 ">
                            <p className="text-text-dark text-[1.4em] font-medium px-2.5 bg-mal-blue rounded-xs uppercase">Score</p>
                            <p className="text-[1.8em]/snug font-semibold">{animeQ?.data?.score}</p>
                            <p className="font-light text-[1.25em]">{animeQ?.data?.scored_by?.toLocaleString()} users</p>
                          </div>
                          {/* <div className="grid grid-cols-3 items-end md:gap-x-8 lg:gap-x-10 capitalize">
                            <div className="flex flex-col">
                              <p className="text-[1.8em]">Ranked</p>
                              <p className="text-[1.4em]">#{animeQ?.data?.rank}</p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[1.8em]">Popularity</p>
                              <p className="text-[1.4em]">#{animeQ?.data?.popularity}</p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[1.8em]">Members</p>
                              <p className="text-[1.4em]">{animeQ?.data?.members.toLocaleString()}</p>
                            </div>
                            <p className="flex flex-row text-[1.2em]">
                              {animeQ?.data?.season} {animeQ?.data?.year}
                            </p>
                            <p className="text-[1.2em]">{animeQ?.data?.type}</p>
                            <div className="flex flex-row space-x-1.5 flex-wrap text-[1.2em]">
                              {animeQ?.data?.studios.map((studio, i) => (
                                <a href={`/producer/${studio.mal_id}`} className="blue-link" key={i}>{studio.name}</a>
                              ))}
                            </div>
                          </div> */}

                          <div className="flex flex-col py-1 gap-y-1">
                            <div className="grid grid-cols-3 items-start capitalize">
                              <div className="flex flex-col">
                                <p className="text-[1.8em]">Ranked</p>
                                <p className="text-[1.4em]">#{animeQ?.data?.rank}</p>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[1.8em]">Popularity</p>
                                <p className="text-[1.4em]">#{animeQ?.data?.popularity}</p>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[1.8em]">Members</p>
                                <p className="text-[1.4em]">{animeQ?.data?.members?.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 items-start divide-x divide-amethyst-smoke-950/40 dark:divide-amethyst-smoke-200/40">
                              <p className="text-[1.2em] pr-2">{animeQ?.data?.type}</p>

                              <p className="flex flex-row text-[1.2em]">
                                {animeQ?.data?.season} {animeQ?.data?.year}
                              </p>

                              <div className="flex flex-row space-x-1.5 flex-wrap text-[1.2em]">
                                {animeQ?.data?.studios.map((studio, i) => (
                                  <a href={`/producer/${studio.mal_id}`} className="blue-link" key={i}>
                                    {studio.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {windowWidth > 480 ? (
                        <div className="w-full rounded-lg box-colors order-2 overflow-hidden">
                          <div id="background">
                            <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">background</div>
                            <div className="flex flex-col px-3 py-2">
                              <div className="peer">
                                <input type="checkbox" name="background-text-checkbox" id="background-text-checkbox" className="hidden" />
                              </div>
                              <p className="text-xs font-light max-lines-3 cutoff-text min-h-8">{animeQ?.data?.background || "No background found."}</p>
                              {animeQ?.data?.background ? (
                                <div className="w-full flex flex-row justify-end text-xs capitalize">
                                  <label
                                    htmlFor="background-text-checkbox"
                                    className=" hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300 before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                  ></label>
                                </div>
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
                    <div className="w-full rounded-lg box-colors order-2 overflow-hidden">
                      <div id="background">
                        <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">background</div>
                        <div className="flex flex-col px-3 py-2">
                          <div className="peer">
                            <input type="checkbox" name="background-text-checkbox" id="background-text-checkbox" className="hidden" />
                          </div>
                          <p className="text-xs font-light max-lines-4 cutoff-text min-h-8">{animeQ?.data?.background || "No background found."}</p>
                          {animeQ?.data?.background ? (
                            <div className="w-full flex flex-row justify-end text-xs capitalize">
                              <label
                                htmlFor="background-text-checkbox"
                                className=" hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300 before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                              ></label>
                            </div>
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
                  <div className="w-fit md:w-1/4 max-w-sm flex flex-col justify-between h-fit gap-y-2 md:gap-y-8 rounded-lg box-colors">
                    <div id="information" className="w-full">
                      <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">information</div>
                      <div className="px-3 py-2 text-xs font-light">
                        <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                          {renderInfoStr("type", `${animeQ?.data?.type}`)}
                          {renderInfoStr("episodes", `${animeQ?.data?.episodes ?? "unknown"}`)}
                          {renderInfoStr("status", `${animeQ?.data?.status}`)}
                          {renderInfoStr("aired", `${animeQ?.data?.aired.string}`)}
                          {renderInfoStr("premiered", `${animeQ?.data?.season} ${animeQ?.data?.year}`)}
                          {renderInfoStr("broadcast", `${animeQ?.data?.broadcast.string}`)}
                          {renderInfoArr("producers", animeQ?.data?.producers, "/producer")}
                          {renderInfoArr("licensors", animeQ?.data?.licensors)}
                          {renderInfoArr("studios", animeQ?.data?.studios, "/producer")}
                          {renderInfoStr("source", `${animeQ?.data?.source}`)}
                          {renderInfoArr("genres", animeQ?.data?.genres)}
                          {renderInfoArr("themes", animeQ?.data?.themes)}
                          {renderInfoArr("demographics", animeQ?.data?.demographics)}
                          {renderInfoStr("duration", `${animeQ?.data?.duration}`)}
                          {renderInfoStr("rating", `${animeQ?.data?.rating}`)}
                        </div>
                      </div>
                    </div>
                    <div id="statistics" className="w-full">
                      <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">statistics</div>
                      <div className="px-3 py-2 text-xs font-light">
                        <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                          {renderInfoStr("score", `${animeQ?.data?.score} (scored by ${animeQ?.data?.scored_by?.toLocaleString()} users) `)}
                          {renderInfoStr("ranked", `#${animeQ?.data?.rank}`)}
                          {renderInfoStr("popularity", `#${animeQ?.data?.popularity}`)}
                          {renderInfoStr("members", `${animeQ?.data?.members.toLocaleString()}`)}
                          {renderInfoStr("favorites", `${animeQ?.data?.favorites.toLocaleString()}`)}
                        </div>
                      </div>
                    </div>
                    <div id="external" className="w-full">
                      <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Available At</div>
                      <div className="px-3 py-2 text-xs font-light">
                        <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                          {animeQ?.data?.external.map((ext, i) => (
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
                    {animeQ?.data?.streaming?.length ? (
                      <div id="streaming" className="w-ful">
                        <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Streaming Platforms</div>
                        <div className="flex flex-col gap-y-2.5 px-3 py-2 text-xs font-light">
                          {animeQ?.data?.streaming.map((stream, i) => (
                            <div className="flex flex-row gap-x-2 items-center" key={i}>
                              {renderIcon(stream.name)}
                              <a className="blue-link" href={stream.url}>
                                {stream.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="w-full md:w-3/4 flex flex-col md:flex-row flex-wrap gap-3 h-fit">
                    <div className="flex flex-col md:flex-row gap-3 w-full order-1">
                      {animeQ?.data?.trailer.embed_url && (
                        <div id="trailer" className="rounded-lg box-colors overflow-hidden w-full h-fit md:w-1/2 order-2 md:order-1">
                          <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed">Watch Trailer</div>
                          <div className="w-full aspect-video">
                            <iframe
                              className="w-full h-full"
                              src={animeQ?.data?.trailer.embed_url.split("&autoplay")[0]}
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
                        <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">titles</div>
                        <div className="flex flex-col gap-y-1 px-3 py-2 text-xs font-light">
                          {animeQ?.data?.titles.map((title, i) => (
                            <div key={i} className="flex flex-row space-x-1 w-full">
                              <p className="font-semibold min-w-16">{title.type}: </p>
                              <p>{title.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div id="synopsis" className="rounded-lg box-colors h-fit w-full order-2">
                      <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">synopsis</div>
                      <div className="flex flex-col space-y-1.5 px-3 py-2 items-end">
                        <div className="peer">
                          <input className="hidden " type="checkbox" name="synopsisCheckbox" id="synopsisCheckbox" />
                        </div>
                        <p className="w-full text-xs font-light overflow-hidden max-lines-4 cutoff-text">{animeQ?.data?.synopsis || "synopsis missing.."}</p>
                        {animeQ?.data?.synopsis ? (
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
                    <div id="Pictures" className="box-colors rounded-md order-3">
                      <Pictures pictures={picturesQ?.data} openGallery={openGallery} cols={2} />
                    </div>

                    {charactersQ?.data?.dataArr.length ? (
                      <div id="characters" className="flex justify-center w-full h-fit order-4">
                        <div className="rounded-lg box-colors w-full ">
                          <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Characters & Voice Actors</div>
                          <CardBox dataArr={charactersQ?.data?.dataArr} />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {animeQ?.data?.flattenedRelations.length ? (
                      <div id="relations" className="flex justify-center w-full h-fit text-2xs lg:text-xs order-5">
                        <div className="rounded-lg box-colors w-full ">
                          <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Related Entries</div>

                          <div className="grid grid-cols-1 xs:grid-cols-2 auto-rows-fr gap-y-2 p-2">
                            {animeQ?.data?.flattenedRelations.slice(0, 6).map((entry, i) => (
                              <div key={i} className="flex flex-row w-full">
                                <a className="w-1/4 max-w-14 h-full aspect-2/3 " href={`/${entry.type}/${entry.mal_id}`}>
                                  <img data-mal-id={entry.mal_id} className="w-full h-full object-cover" src={relationsImgs?.find((r) => r.mal_id === entry.mal_id)?.image ?? null} alt={entry.name} />
                                </a>
                                <div className="w-3/4 flex flex-col gap-y-1 px-2">
                                  <a href={`/${entry.type}/${entry.mal_id}`} className="blue-link">
                                    {entry.name}
                                  </a>
                                  <p>
                                    {entry.relation} ({entry.type})
                                  </p>
                                </div>
                              </div>
                            ))}
                            {!showAllRelations && animeQ?.data?.flattenedRelations.length > 6 ? (
                              <div
                                onClick={() => {
                                  setShowAllRelations(true);
                                }}
                                className="flex flex-row justify-center items-center w-full text-2xl border-4 border-amethyst-smoke-400/30 hover:cursor-pointer hover:bg-amethyst-smoke-400/20"
                              >
                                +{animeQ?.data?.flattenedRelations.length - 6}
                              </div>
                            ) : (
                              ""
                            )}
                            {showAllRelations
                              ? animeQ?.data?.flattenedRelations.slice(6).map((entry, i) => (
                                  <div key={i} className="flex flex-row w-full">
                                    <a className="w-1/4 max-w-14 h-full aspect-2/3 " href={`/${entry.type}/${entry.mal_id}`}>
                                      <img
                                        className="w-full h-full object-cover"
                                        data-mal-id={entry.mal_id}
                                        src={relationsImgs?.find((r) => r.mal_id === entry.mal_id)?.image ?? null}
                                        alt={entry.name}
                                      />
                                    </a>
                                    <div className="w-3/4 flex flex-col gap-y-1 px-2">
                                      <a href={`/${entry.type}/${entry.mal_id}`} className="blue-link">
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
                    ) : (
                      ""
                    )}

                    {animeQ?.data?.theme.openings.length || animeQ?.data?.theme.endings.length ? (
                      <div id="theme" className="flex justify-center w-full h-fit text-2xs lg:text-[11px] order-6">
                        <div className="rounded-lg box-colors w-full grid grid-cols-2 gap-4 py-1">
                          {animeQ?.data?.theme.openings.length ? (
                            <div id="openings">
                              <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">openings</div>
                              <div className="flex flex-col w-full gap-y-2 p-2">
                                {animeQ?.data?.theme.openings.map((opening, i) => (
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
                          {animeQ?.data?.theme.endings.length ? (
                            <div id="endings">
                              <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">endings</div>
                              <div className="flex flex-col w-full gap-y-2 p-2">
                                {animeQ?.data?.theme.endings.map((ending, i) => (
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

                {reviewsQ?.data?.featured.length ? (
                  <div id="reviews" className="order-3 rounded-lg box-colors w-full py-1">
                    <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">reviews</div>
                    <div className="flex flex-col w-full text-2xs/normal sm:text-xs/normal gap-y-2 py-2 px-3">
                      <div className="flex flex-row flex-wrap gap-y-1 justify-between bottom-border pb-2">
                        <div className="flex flex-row items-center gap-x-1 py-1 px-3 bg-amethyst-smoke-700/30 text-2xs">
                          <p>Avg Score</p>
                          <p className="">{reviewsQ?.data?.stats.avgScore.toFixed(2)}</p>
                          <Star size={14} color="yellow" />
                        </div>
                        <div className="flex flex-col py-1 px-2 bg-amethyst-smoke-700/30">
                          <div className="flex flex-row flex-wrap items-center gap-x-3 rounded-sm text-2xs">
                            <div className="flex flex-row items-center capitalize gap-x-1 blue-link">
                              <Star size={12} className="stroke-blue-800 dark:stroke-blue-400" />
                              <p>{reviewsQ?.data?.stats.recommended}</p>
                              <p>recommended</p>
                            </div>
                            <div className="flex flex-row items-center capitalize gap-x-1 gray-link">
                              <Star size={12} className="stroke-gray-800 dark:stroke-gray-400" />
                              <p>{reviewsQ?.data?.stats.mixedFeelings}</p>
                              <p>mixed feelings</p>
                            </div>
                            <div className="flex flex-row items-center capitalize gap-x-1 rose-link">
                              <Star size={12} className="stroke-rose-800 dark:stroke-rose-400" />
                              <p>{reviewsQ?.data?.stats.notRecommended}</p>
                              <p>not recommended</p>
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundImage: `linear-gradient(90deg, var(--color-blue-400) ${((reviewsQ?.data?.stats.recommended - 1.5) * 100) / reviewsQ?.data?.stats.all}%, var(--color-gray-400) ${((reviewsQ?.data?.stats.recommended + 1.5) * 100) / reviewsQ?.data?.stats.all}%, var(--color-gray-400) ${((reviewsQ?.data?.stats.recommended + reviewsQ?.data?.stats.mixedFeelings - 1.5) * 100) / reviewsQ?.data?.stats.all}%, var(--color-rose-400) ${((reviewsQ?.data?.stats.recommended + reviewsQ?.data?.stats.mixedFeelings + 1.5) * 100) / reviewsQ?.data?.stats.all}%)`,
                            }}
                            className="h-1 w-full px-3"
                          ></div>
                        </div>
                        <div className="flex flex-row items-center gap-x-1 text-2xs">
                          <ChevronRight size={12} />
                          <p>All reviews ({reviewsQ?.data?.stats.all})</p>
                        </div>
                      </div>
                      {reviewsQ?.data?.featured.map((review) => (
                        <div key={review.mal_id} className="bottom-border">
                          <div className="flex flex-col xs:flex-row">
                            <div className="flex flex-col ml-3 xs:m-0 justify-start w-[5%] min-w-10">
                              <a href={review.user.url} className="w-full aspect-square">
                                <img className="w-full h-full object-cover" src={review.user.images.webp.image_url} alt={`${review.user.username}-picture`} />
                              </a>
                            </div>
                            <div className="flex flex-col w-[95%] px-3">
                              <div className="flex flex-row justify-between items-center">
                                <a className="blue-link font-semibold" href={review.user.url}>
                                  {review.user.username}
                                </a>
                                <p className="text-2xs/snug font-light">{dateFormatter(review.date)}</p>
                              </div>
                              <div className="flex flex-row justify-between items-start gap-x-2.5">
                                {review.tags.map((t, i) => (
                                  <div key={i} className="flex flex-row items-center gap-x-1 px-1.5 border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-400/20">
                                    <Star
                                      size={14}
                                      className={`${t === "Recommended" ? "stroke-blue-800 dark:stroke-blue-400" : t === "Not Recommended" ? "stroke-rose-800 dark:stroke-rose-400 " : "stroke-gray-800 dark:stroke-gray-400"}`}
                                    />
                                    <p
                                      className={`${t === "Recommended" ? "text-blue-800 dark:text-blue-400" : t === "Not Recommended" ? "text-rose-800 dark:text-rose-400" : "text-gray-800 dark:text-gray-400"}`}
                                    >
                                      {t}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-col gap-y-2 w-full py-3">
                                <div className="peer">
                                  <input type="checkbox" className="hidden" name={`review-${review.mal_id}`} id={`review-${review.mal_id}`} />
                                </div>
                                <p className="w-full whitespace-pre-wrap max-lines-4 cutoff-text">{review.review}</p>

                                <div className="w-[97%] flex flex-row gap-x-2 items-center justify-between">
                                  <div className="flex flex-row flex-wrap space-x-1 items-center">
                                    {renderReactions(review.reactions)}
                                    <p>{review.reactions.overall}</p>
                                  </div>
                                  <label
                                    htmlFor={`review-${review.mal_id}`}
                                    className="text-xs capitalize hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                                                              before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                  ></label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {recommendationsQ?.data?.recommendations.length ? (
                  <div id="recommendations" className="order-4 rounded-lg box-colors w-full py-1">
                    <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">recommendations</div>
                    <CardBox dataArr={recommendationsQ?.data?.recommendationsDataArr} num={7} aspect="2/3" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
              <img className="w-full h-full aspect-auto object-cover blur-lg scale-105 brightness-35 bg-repeat-y" src={animeQ?.data?.images.jpg.large_image_url} alt={animeQ?.data?.title} />
            </div>
          </div>

          {showModal && (
            <Gallery
              name={animeQ?.data?.name}
              pictures={picturesQ?.data}
              activeIndex={activeIndex}
              closeGallery={closeGallery}
              onNext={() => dispatch({ type: "next" })}
              onPrev={() => dispatch({ type: "prev" })}
              onOpen={(index) => dispatch({ type: "open", newIndex: index })}
            />
          )}
        </>
      )}
    </>
  );
}
