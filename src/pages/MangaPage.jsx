import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { WindowContext } from "../App";
import { renderInfoStr, renderInfoArr, renderIcon } from "../utility/utils";
import useGallery from "../utility/useGallery";
import Gallery from "../components/character/Gallery";
import Pictures from "../components/character/Pictures";
import CharacterCardBox from "../components/CardBox/CharacterCardBox";
import { useRelations } from "../utility/useRelations";

export default function MangaPage() {
  let { id } = useParams();
  const { windowWidth } = useContext(WindowContext);
  const [mangaData, setMangaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { dispatch, showModal, openGallery, closeGallery, activeIndex } = useGallery(mangaData?.pictures ?? []);

  useEffect(() => {
    async function fetchManga() {
      try {
        const [resData, resPictures, resCharacters] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/manga/${id}/full`),
          fetch(`https://api.jikan.moe/v4/manga/${id}/pictures`),
          fetch(`https://api.jikan.moe/v4/manga/${id}/characters`),
        ]);
        const [manga_Data, pictures_Data, characters_Data] = await Promise.all([resData.json(), resPictures.json(), resCharacters.json()]);
        setMangaData({
          ...manga_Data?.data,
          pictures: pictures_Data?.data,
          characters: characters_Data?.data,
          flattenedRelations: manga_Data.data?.relations.flatMap(({ relation, entry }) => entry.map((item) => ({ ...item, relation }))),
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchManga();
  }, [id]);

  const dataArr = mangaData?.characters?.map(({ role, character }) => ({
    character: { path: "character", role, ...character },
  }));

  const { relationsImgs, showAllRelations, setShowAllRelations, dataRef, getImage, fetchRelations, fetchSingleRelation, checkRelatedEntriesImgs, timesFetchedRef } = useRelations(mangaData);

  // side effect that runs when the mangaData is fetched and then fetches relationsImgs for the first 6 relations
  // set the mangaDataRef to point towards the mangaData which is useful to solve the stale-closure that occurs later in checkRelatedEntriesImgs()
  useEffect(() => {
    if (!mangaData) return;
    fetchRelations(0, 6);
    dataRef.current = mangaData;
  }, [mangaData]);

  // side effect that sets a 5sec interval fot the check function, first a similar check runs to terminate the interval in the case that all images have src value,
  // otherwise it calls the checkRelatedEntriesImgs() function
  useEffect(() => {
    const interval = setInterval(() => {
      const undefinedCheck = Array.from(document.querySelectorAll("#relations>div>div.grid>div>a>img")).some((e) => e.src == null || e.src === "");
      if (undefinedCheck) {
        checkRelatedEntriesImgs();
        timesFetchedRef.current = timesFetchedRef.current + 1;
      } else {
        clearInterval(interval);
      }
      if (timesFetchedRef.current >= 10) {
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <div className="relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 text-dark-amethyst-smoke-50 dark:text-text-dark">
          <div className="w-[95vw] flex flex-col space-y-3">
            <div id="title" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col">
              <span className="text-sm/relaxed sm:text-lg/relaxed">{mangaData.title}</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65">{mangaData.title_japanese}</span>
                <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={mangaData.url} target="_blank">
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
                      <img className="h-full w-full object-cover rounded-lg overflow-hidden" src={mangaData?.images?.jpg.large_image_url} alt={mangaData?.title} />
                    </div>
                  </div>
                  <div className="order-1 flex flex-col gap-3">
                    <div id="details" className="box-colors rounded-lg w-fit pt-0.5">
                      <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Details</div>
                      <div className="p-2 flex flex-row flex-wrap gap-2 text-4xs sm:text-3xs">
                        <div className="flex flex-col justify-between pr-2 items-center border-r border-amethyst-smoke-500/20 ">
                          <p className="text-text-dark text-[1.4em] font-medium px-2.5 bg-mal-blue rounded-xs uppercase">Score</p>
                          <p className="text-[1.8em]/snug font-semibold">{mangaData?.score || "N/A"}</p>
                          <p className="font-light text-[1.25em]">{mangaData?.scored_by?.toLocaleString() || "-"} users</p>
                        </div>
                        <div>
                          <div className="grid grid-cols-3 grid-rows-3 items-end gap-x-3  2xs:gap-x-6 md:gap-x-8 lg:gap-x-10 capitalize ">
                            <div className="row-span-2 flex flex-col">
                              <p className="text-[1.8em]">Ranked</p>
                              <p className="text-[1.4em]">#{mangaData?.rank}</p>
                            </div>
                            <div className="row-span-2 flex flex-col">
                              <p className="text-[1.8em]">Popularity</p>
                              <p className="text-[1.4em]">#{mangaData?.popularity}</p>
                            </div>
                            <div className="row-span-2 flex flex-col">
                              <p className="text-[1.8em]">Members</p>
                              <p className="text-[1.4em]">{mangaData?.members?.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex flex-row items-center gap-x-2">
                            <p className="text-[1.2em] pr-2 border-r border-amethyst-smoke-950/40 dark:border-amethyst-smoke-200/40">{mangaData?.type}</p>
                            <p className="flex flex-row gap-x-0.5 items-center text-[1.2em] pr-2 border-r border-amethyst-smoke-950/40 dark:border-amethyst-smoke-200/40">
                              {mangaData?.serializations?.map((s, i) => (
                                <a key={i} className="blue-link-b" href={s.url}>
                                  {s.name}
                                </a>
                              ))}
                            </p>
                            <div className="flex flex-row items-center text-[1.2em]">
                              {mangaData?.authors?.map((s, i, arr) => (
                                <p key={i}>
                                  <a className="blue-link-b" href={s.url}>
                                    {s.name}
                                  </a>
                                  <span className="mr-1.5">{i < arr.length - 1 ? "," : ""}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {windowWidth > 480 ? (
                      <div className="w-full rounded-lg box-colors order-2 overflow-hidden">
                        <div id="background" className="pt-0.5">
                          <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">background</div>
                          <div className="flex flex-col px-3 py-2">
                            <div className="peer">
                              <input type="checkbox" name="background-text-checkbox" id="background-text-checkbox" className="hidden" />
                            </div>
                            <p className="text-xs font-light max-lines-3 cutoff-text min-h-8">{mangaData?.background || "No background found."}</p>
                            {mangaData?.background ? (
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
                        <p className="text-xs font-light max-lines-4 cutoff-text min-h-8">{mangaData?.background || "No background found."}</p>
                        {mangaData?.background ? (
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
              <div className="order-2 w-full flex flex-col sm:flex-row gap-3">
                <div className="w-fit sm:w-1/3 md:w-1/4 max-w-sm flex flex-col justify-between h-fit gap-y-2 md:gap-y-8 rounded-lg box-colors">
                  <div id="information" className="w-full pt-0.5">
                    <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">information</div>
                    <div className="px-3 py-2 text-xs font-light">
                      <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                        {renderInfoStr("type", `${mangaData?.type}`)}
                        {renderInfoStr("volumes", `${mangaData?.volumes ?? "?"}`)}
                        {renderInfoStr("chapters", `${mangaData?.chapters ?? "?"}`)}
                        {renderInfoStr("status", `${mangaData?.status}`)}
                        {renderInfoStr("published", `${mangaData?.published?.string}`)}
                        {renderInfoArr("genres", mangaData?.genres)}
                        {renderInfoArr("themes", mangaData?.themes)}
                        {renderInfoArr("demographics", mangaData?.demographics)}
                        {renderInfoArr("serializations", mangaData?.serializations)}
                        {renderInfoArr("authors", mangaData?.authors)}
                      </div>
                    </div>
                  </div>
                  <div id="statistics" className="w-full pt-0.5 ">
                    <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">statistics</div>
                    <div className="px-3 py-2 text-xs font-light">
                      <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                        {renderInfoStr("score", `${mangaData?.score} (scored by ${mangaData?.scored_by?.toLocaleString()} users) `)}
                        {renderInfoStr("ranked", `#${mangaData?.rank}`)}
                        {renderInfoStr("popularity", `#${mangaData?.popularity}`)}
                        {renderInfoStr("members", `${mangaData?.members?.toLocaleString()}`)}
                        {renderInfoStr("favorites", `${mangaData?.favorites?.toLocaleString()}`)}
                      </div>
                    </div>
                  </div>
                  <div id="external" className="w-full">
                    <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Available At</div>
                    <div className="px-3 py-2 text-xs font-light">
                      <div className="grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]">
                        {mangaData?.external.map((ext, i) => (
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
                </div>

                <div className="w-full sm:w-2/3 md:w-3/4 flex flex-col gap-y-2 pt-0.5 ">
                  <div id="titles" className="w-full h-fit rounded-lg box-colors overflow-hidden order-1">
                    <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">titles</div>
                    <div className="flex flex-col gap-y-1 px-3 py-2 text-xs font-light">
                      {mangaData?.titles.map((title, i) => (
                        <div key={i} className="flex flex-row space-x-1 w-full">
                          <p className="font-semibold min-w-16">{title.type}: </p>
                          <p>{title.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div id="synopsis" className="rounded-lg box-colors h-fit w-full order-2 pt-0.5">
                    <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">synopsis</div>
                    <div className="flex flex-col space-y-1.5 px-3 py-2 items-end">
                      <div className="peer">
                        <input className="hidden " type="checkbox" name="synopsisCheckbox" id="synopsisCheckbox" />
                      </div>
                      <p className="w-full text-xs font-light overflow-hidden max-lines-4 cutoff-text">{mangaData?.synopsis || "synopsis missing.."}</p>
                      {mangaData?.synopsis ? (
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
                    <Pictures pictures={mangaData.pictures} openGallery={openGallery} cols={2} />
                  </div>

                  {dataArr?.length ? (
                    <div id="characters" className="flex justify-center w-full h-fit order-4">
                      <div className="rounded-lg box-colors w-full ">
                        <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Characters</div>
                        <CharacterCardBox dataArr={dataArr} num={7} />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {mangaData?.flattenedRelations.length ? (
                    <div id="relations" className="flex justify-center w-full h-fit text-2xs lg:text-xs order-5">
                      <div className="rounded-lg box-colors w-full ">
                        <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">Related Entries</div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 auto-rows-fr gap-y-2 p-2">
                          {mangaData?.flattenedRelations.slice(0, 6).map((entry, i) => (
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
                          {!showAllRelations && mangaData?.flattenedRelations.length > 6 ? (
                            <div
                              onClick={() => {
                                setShowAllRelations(true);
                                fetchRelations(6, mangaData?.flattenedRelations.length);
                              }}
                              className="flex flex-row justify-center items-center w-full text-2xl border-4 border-amethyst-smoke-400/30 hover:cursor-pointer hover:bg-amethyst-smoke-400/20"
                            >
                              +{mangaData?.flattenedRelations.length - 6}
                            </div>
                          ) : (
                            ""
                          )}
                          {showAllRelations
                            ? mangaData?.flattenedRelations.slice(6).map((entry, i) => (
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
                </div>
              </div>
            </div>

            <div id="backgroundImage" className="-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden">
              <img className="w-full h-full aspect-auto object-cover blur-lg scale-105 brightness-35 bg-repeat-y" src={mangaData?.images.jpg.large_image_url} alt={mangaData?.title} />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <Gallery
          name={mangaData.name}
          pictures={mangaData.pictures}
          activeIndex={activeIndex}
          closeGallery={closeGallery}
          onNext={() => dispatch({ type: "next" })}
          onPrev={() => dispatch({ type: "prev" })}
          onOpen={(index) => dispatch({ type: "open", newIndex: index })}
        />
      )}
    </>
  );
}
