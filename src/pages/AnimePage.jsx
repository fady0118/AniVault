import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Character from "../components/anime/Character";

export default function AnimePage() {
  let { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchAnime() {
      try {
        const [resAnime, resCharacters] = await Promise.all([fetch(`https://api.jikan.moe/v4/anime/${id}/full`), fetch(`https://api.jikan.moe/v4/anime/${id}/characters`)]);
        const [animeData, charactersData] = await Promise.all([resAnime.json(), resCharacters.json()]);
        setAnimeData({ ...animeData.data, characters: charactersData.data } ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnime();
  }, [id]);
useEffect(()=>{
  console.log(animeData)
},[animeData])

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 mt-15 text-dark-amethyst-smoke-50 dark:text-text-dark">
            <div id="title" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col">
              <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{animeData.title}</div>
              <div className="text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65">{animeData.title_english}</div>
            </div>

            <div className="flex flex-col md:flex-row sm:justify-between order-2">
              <div className="w-full md:w-1/4 rounded-xl box-colors min-h-52 order-1 overflow-hidden">
                <div id="poster" className="w-full">
                  <img className="w-full object-cover" src={animeData.images.jpg.large_image_url} alt={animeData.title} />
                </div>
              </div>

              <div className="w-full md:w-[45%] py-2 flex flex-col space-y-2 rounded-xl box-colors min-h-52 order-2 overflow-hidden">
                <div id="trailer">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed">Watch Trailer</div>
                  <div className="w-full aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={animeData.trailer.embed_url.split("&autoplay")[0]}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div id="synopsis">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">synopsis</div>
                  <div className="flex flex-col space-y-1.5 px-3 pt-2 items-end">
                    <div className="peer">
                      <input className="hidden " type="checkbox" name="synopsisCheckbox" id="synopsisCheckbox" />
                    </div>
                    <p className={`w-full text-xs font-light overflow-hidden max-lines-3 cutoff-text`}>{animeData.synopsis || "synopsis missing.."}</p>
                    <label
                      htmlFor="synopsisCheckbox"
                      className="text-xs capitalize w-fit hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                      before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                    ></label>
                  </div>
                </div>
                <div id="characters">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Characters & Voice Actors</div>
                  <div className="overflow-x-scroll flex mt-2 space-x-0.5">
                    {animeData.characters.map((character) => (
                      <Character key={character.character.mal_id} character={character} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[27.5%] py-2 rounded-xl box-colors min-h-52 order-3 overflow-hidden">
                <div id="background">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">background</div>
                  <div className="px-3 py-2 text-xs font-light">{animeData.background || "background missing.."}</div>
                  {/* @todo - find an alternative way to fill in the background */}
                </div>
              </div>
            </div>
          </div>

          <div id="backgroundImage" className="z-0 absolute top-0 left-0 w-screen overflow-hidden">
            <img className="w-full min-h-screen aspect-auto object-cover blur-lg scale-105 brightness-35 " src={animeData.images.jpg.large_image_url} alt={animeData.title} />
          </div>
        </>
      )}
    </>
  );
}
