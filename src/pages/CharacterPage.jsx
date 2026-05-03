import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CharacterPage() {
  const { id } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchCharacter() {
      try {
        const [resCharacter, resCharacterPics] = await Promise.all([fetch(`https://api.jikan.moe/v4/characters/${id}/full`), fetch(`https://api.jikan.moe/v4/characters/${id}/pictures`)]);
        const [character_Data, characterPics_Data] = await Promise.all([resCharacter.json(), resCharacterPics.json()]);
        setCharacterData({ ...character_Data.data, pictures: characterPics_Data.data } ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCharacter();
  }, [id]);

  useEffect(() => {
    console.log(characterData);
  }, [characterData]);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 mt-15">
          <div id="name" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col">
            <div className="flex flex-wrap space-x-1 items-end font-bold">
              <span className="text-sm/relaxed sm:text-lg/relaxed">{characterData.name}</span>
              {characterData.nicknames.map((nickname) => (
                <span className="text-xs/relaxed sm:text-md/relaxed">"{nickname}"</span>
              ))}
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65">{characterData.name_kanji}</span>
              <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={characterData.url} target="_blank">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                  alt="MyAnimeList Logo"
                  className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                />
              </a>
            </div>
          </div>
          <div className="w-full order-2 flex space-x-3">
            <div id="image" className="w-1/5 min-w-24">
              <img className="w-full aspect-2/3 object-cover order-1 rounded-lg overflow-hidden" src={characterData.images.jpg.image_url} alt="" />
            </div>

            <div id="about" className="order-2 w-4/5 pt-2 rounded-lg overflow-hidden box-colors">
              <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">About</div>
              <div className="p-3 text-xs font-light whitespace-pre-wrap">{characterData.about || "about missing.."}</div>
            </div>
          </div>
          <div className="order-3 flex flex-row space-x-2">
            <div id="Animeography" className="box-colors w-1/4 rounded-md py-2 h-fit">
              <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Animeography</div>
              <div className="flex flex-col pt-2 space-y-2">
                {characterData.anime.map((anime) => (
                  <div key={anime.anime.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                    <a className="w-1/3" href={`/anime/${anime.anime.mal_id}`}>
                      <img className="w-full aspect-3/4 object-cover" src={anime.anime.images.webp.image_url} alt={anime.anime.title} />
                    </a>
                    <div className="flex flex-col w-2/3 space-y-1">
                      <a href={`/anime/${anime.anime.mal_id}`}>
                        <p className="text-xs text-blue-400">{anime.anime.title}</p>
                      </a>
                      <p className="text-2xs">{anime.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div id="Mangaography" className="box-colors w-1/4 rounded-md py-2 h-fit">
              <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Mangaography</div>
              <div className="flex flex-col pt-2 space-y-2">
                {characterData.manga.map((manga) => (
                  <div key={manga.manga.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                    <a className="w-1/3" href={`/manga/${manga.manga.mal_id}`}>
                      <img className="w-full aspect-3/4 object-cover" src={manga.manga.images.webp.image_url} alt={manga.manga.title} />
                    </a>
                    <div className="flex flex-col w-2/3 space-y-1">
                      <a href={`/anime/${manga.manga.mal_id}`}>
                        <p className="text-xs text-blue-400">{manga.manga.title}</p>
                      </a>
                      <p className="text-2xs">{manga.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-2 w-1/2 ">
              <div id="Voices" className="box-colors rounded-md py-2">
                <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Voice Actors</div>
              </div>
              <div id="Pictures" className="box-colors rounded-md py-2">
                <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Pictures</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
