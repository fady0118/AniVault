import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import Pictures from "../components/character/Pictures";
import Gallery from "../components/character/Gallery";
import useGallery from "../utility/useGallery";

export default function CharacterPage() {
  const { id } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchCharacter() {
      try {
        const [resCharacter, resCharacterPics] = await Promise.all([fetch(`https://api.jikan.moe/v4/characters/${id}/full`), fetch(`https://api.jikan.moe/v4/characters/${id}/pictures`)]);
        const [character_Data, characterPics_Data] = await Promise.all([resCharacter.json(), resCharacterPics.json()]);
        setCharacterData({ ...character_Data.data, pictures: characterPics_Data.data || [] } ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCharacter();
  }, [id]);

  const { dispatch, showModal, openGallery, closeGallery, activeIndex } = useGallery(characterData?.pictures ?? []);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15">
            <div id="name" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col">
              <div className="flex flex-wrap space-x-1 items-end font-bold">
                <span className="text-sm/relaxed sm:text-lg/relaxed">{characterData.name}</span>
                {characterData.nicknames.map((nickname) => (
                  <span key={nickname} className="text-xs/relaxed sm:text-md/relaxed">
                    "{nickname}"
                  </span>
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
            <div className="w-full order-2 flex flex-col sm:flex-row gap-3">
              <div id="image" className="w-1/5 min-w-24 ">
                <img className="w-full aspect-2/3 object-cover order-1 rounded-lg overflow-hidden" src={characterData.images.jpg.image_url} alt="" />
              </div>

              <div id="about" className="order-2 w-full sm:w-4/5 pt-2 rounded-lg overflow-hidden box-colors">
                <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">About</div>
                <div className="p-3 text-xs font-light flex flex-col space-y-2">
                  <p className="whitespace-pre-wrap">{characterData.about || "No biography written."}</p>
                  <p>Member Favorites: {characterData.favorites}</p>
                </div>
              </div>
            </div>
            <div className="order-3 flex flex-col md:flex-row gap-3">
              <div className="order-2 md:order-1 flex flex-col sm:flex-row gap-3 w-full md:w-1/2">
                <div id="Animeography" className="order-1 box-colors w-full sm:w-1/2 rounded-md py-2 h-fit">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Animeography</div>
                  <div className="flex flex-col pt-2 space-y-2">
                    {!characterData.anime.length ? (
                      <p className="p-3 text-xs font-light">No animeography found.</p>
                    ) : (
                      characterData.anime.map((anime) => (
                        <div key={anime.anime.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                          <a className="w-1/4" href={`/anime/${anime.anime.mal_id}`}>
                            <img className="w-full aspect-3/4 object-cover" src={anime.anime.images.webp.image_url} alt={anime.anime.title} />
                          </a>
                          <div className="flex flex-col w-3/4 space-y-1">
                            <a href={`/anime/${anime.anime.mal_id}`}>
                              <p className="text-xs text-blue-400">{anime.anime.title}</p>
                            </a>
                            <p className="text-2xs">{anime.role}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div id="Mangaography" className="order-2 box-colors w-full sm:w-1/2 rounded-md py-2 h-fit">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Mangaography</div>
                  <div className="flex flex-col pt-2 space-y-2">
                    {!characterData.manga.length ? (
                      <p className="p-3 text-xs font-light">No mangaography found.</p>
                    ) : (
                      characterData.manga.map((manga) => (
                        <div key={manga.manga.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                          <a className="w-1/4" href={`/manga/${manga.manga.mal_id}`}>
                            <img className="w-full aspect-3/4 object-cover" src={manga.manga.images.webp.image_url} alt={manga.manga.title} />
                          </a>
                          <div className="flex flex-col w-3/4 space-y-1">
                            <a href={`/manga/${manga.manga.mal_id}`}>
                              <p className="text-xs text-blue-400">{manga.manga.title}</p>
                            </a>
                            <p className="text-2xs">{manga.role}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 flex flex-col space-y-2 w-full md:w-1/2">
                <div id="Voices" className="box-colors rounded-md py-2">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Voice Actors</div>
                  <div className="grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 pt-2">
                    {!characterData.voices.length ? (
                      <p className="p-3 text-xs font-light">No voice actors found.</p>
                    ) : (
                      characterData.voices.map((voice) => (
                        <div key={voice.person.mal_id} className="w-full flex gap-1 px-2 border-b border-amethyst-smoke-400/20">
                          <a className="w-1/4 aspect-2/3 " href={`/people/${voice.person.mal_id}`}>
                            <img className="w-full h-full object-cover" src={voice.person.images.jpg.image_url} alt={voice.person.name} />
                          </a>
                          <div className="flex flex-col w-3/4 gap-1">
                            <a className="text-xs text-blue-400" href={`/people/${voice.person.mal_id}`}>
                              {voice.person.name}
                            </a>
                            <p className="text-2xs">{voice.language}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div id="Pictures" className="box-colors rounded-md py-2">
                  <Pictures pictures={characterData.pictures} openGallery={openGallery} />
                </div>
              </div>
            </div>
          </div>
          {showModal && (
            <Gallery
              data={characterData}
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
