import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Character from "../components/CardBox/Box";
import CharacterCardBox from "../components/CardBox/CharacterCardBox";
import { WindowContext } from "../App";

export default function AnimePage() {
  let { id } = useParams();
  const [animeData, setanimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { windowWidth } = useContext(WindowContext);
  useEffect(() => {
    async function fetchAnime() {
      try {
        const [resAnime, resCharacters] = await Promise.all([fetch(`https://api.jikan.moe/v4/anime/${id}/full`), fetch(`https://api.jikan.moe/v4/anime/${id}/characters`)]);
        const [anime_Data, characters_Data] = await Promise.all([resAnime.json(), resCharacters.json()]);
        setanimeData({ ...anime_Data.data, characters: characters_Data.data } ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnime();
  }, [id]);

  const dataArr = animeData?.characters.map(({ role, character, voice_actors }) => ({
    character: { path: "character", role, ...character },
    voice_actor: { path: "people", ...voice_actors.find((actor) => actor.language === "Japanese")?.person },
  }));

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 mt-15 text-dark-amethyst-smoke-50 dark:text-text-dark">
            <div id="title" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col">
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

            <div className="flex flex-col sm:justify-between order-2">
              <div className="w-full order-1 flex flex-col gap-3">
                <div className="flex flex-col xs:flex-row items-stretch gap-3 w-full">
                  <div className="w-1/5 min-w-24 2xs:min-w-36 aspect-2/3 rounded-xl box-colors order-1 overflow-hidden self-auto shrink-0">
                    <div id="poster" className="w-full h-full">
                      <img className="h-full w-full object-cover rounded-lg overflow-hidden" src={animeData?.images.jpg.large_image_url} alt={animeData?.title} />
                    </div>
                  </div>
                  <div className="order-1 flex flex-col gap-3">
                    <div id="details" className="box-colors rounded-lg  w-fit p-2 flex flex-row flex-wrap gap-2 text-4xs sm:text-3xs">
                      <div className="flex flex-col justify-between pr-2 items-center border-r border-amethyst-smoke-500/20 ">
                        <p className="text-text-dark text-[1.5em] font-medium px-2 bg-mal-blue rounded-xs uppercase">Score</p>
                        <p className="text-[2em]/snug font-semibold">{animeData.score}</p>
                        <p className="font-light text-[1.2em]">{animeData.scored_by.toLocaleString()} users</p>
                      </div>

                      <div className="grid grid-cols-3 grid-rows-3 items-end gap-x-2 xs:gap-x-4 sm:gap-x-6 capitalize ">
                        <div className="row-span-2 flex flex-col">
                          <p className="text-[2em]">Ranked</p>
                          <p className="text-[1.5em]">#{animeData.rank}</p>
                        </div>
                        <div className="row-span-2 flex flex-col">
                          <p className="text-[2em]">Popularity</p>
                          <p className="text-[1.5em]">#{animeData.popularity}</p>
                        </div>
                        <div className="row-span-2 flex flex-col">
                          <p className="text-[2em]">Members</p>
                          <p className="text-[1.5em]">{animeData.members.toLocaleString()}</p>
                        </div>
                        <p className="flex flex-row text-[1.2em]">
                          {animeData.season} {animeData.year}
                        </p>
                        <p className="text-[1.2em]">{animeData.type}</p>
                        <div className="flex flex-row space-x-1.5 flex-wrap text-[1.2em]">
                          {animeData.studios.map((studio, i) => (
                            <p key={i}>{studio.name}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    {windowWidth > 480 ? (
                      <div className="w-full py-2 rounded-xl box-colors order-2 overflow-hidden">
                        <div id="background">
                          <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">background</div>
                          <div className="px-3 py-2 text-xs font-light">{animeData?.background || "No background written."}</div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {windowWidth <= 480 ? (
                  <div className="w-full py-2 rounded-xl box-colors order-2 overflow-hidden">
                    <div id="background">
                      <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">background</div>
                      <div className="px-3 py-2 text-xs font-light">{animeData?.background || "No background written."}</div>
                      {/* @todo - find an alternative way to fill in the background */}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="w-full order-2 md:w-[45%] py-2 flex flex-col space-y-2 rounded-xl box-colors min-h-52 overflow-hidden">
                {animeData?.trailer.embed_url && (
                  <div id="trailer">
                    <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed">Watch Trailer</div>
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
                <div id="synopsis">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">synopsis</div>
                  <div className="flex flex-col space-y-1.5 px-3 pt-2 items-end">
                    <div className="peer">
                      <input className="hidden " type="checkbox" name="synopsisCheckbox" id="synopsisCheckbox" />
                    </div>
                    <p className="w-full text-xs font-light overflow-hidden max-lines-3 cutoff-text">{animeData?.synopsis || "synopsis missing.."}</p>
                    <label
                      htmlFor="synopsisCheckbox"
                      className="text-xs capitalize w-fit hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                      before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                    ></label>
                  </div>
                </div>
                <div id="characters">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Characters & Voice Actors</div>
                  <CharacterCardBox dataArr={dataArr} />
                </div>
              </div>
            </div>
          </div>

          <div id="backgroundImage" className="z-0 absolute top-0 left-0 w-screen overflow-hidden">
            <img className="w-full min-h-screen aspect-auto object-cover blur-lg scale-105 brightness-35 " src={animeData?.images.jpg.large_image_url} alt={animeData?.title} />
          </div>
        </>
      )}
    </>
  );
}
