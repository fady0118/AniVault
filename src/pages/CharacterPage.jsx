import { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router";
import Pictures from "../components/character/Pictures";
import Gallery from "../components/character/Gallery";
import useGallery from "../utility/useGallery";
import { useQueries, useQuery } from "@tanstack/react-query";
import { jikanFetch } from "../utility/jikanApi";
import LoaderComponent from "../components/LoaderComponent";

export default function CharacterPage() {
  const { id } = useParams();
  const [characterQ, characterPicturesQ] = useQueries({
    queries: [
      {
        queryKey: ["character", id],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/characters/${id}/full`);
          if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
          const character_Data = await res.json();
          return character_Data.data || [];
        },
      },
      {
        queryKey: ["pictures", id],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/characters/${id}/pictures`);
          const pictures_Data = await res.json();
          return pictures_Data.data || [];
        },
      },
    ],
  });

  const { dispatch, showModal, openGallery, closeGallery, activeIndex } = useGallery(characterPicturesQ?.data ?? []);

  return (
    <>
      {characterQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">
          <LoaderComponent />
        </div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3">
            <div id="name" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col">
              <div className="flex flex-wrap space-x-1 items-end font-bold">
                <span className="text-sm/relaxed sm:text-lg/relaxed">{characterQ?.data.name}</span>
                {characterQ?.data?.nicknames?.map((nickname) => (
                  <span key={nickname} className="text-xs/relaxed sm:text-md/relaxed">
                    "{nickname}"
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65">{characterQ?.data.name_kanji}</span>
                <Link className="w-7 sm:w-9 rounded-sm overflow-hidden" to={characterQ?.data.url} target="_blank">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                    alt="MyAnimeList Logo"
                    className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                  />
                </Link>
              </div>
            </div>
            <div className="w-full order-2 flex flex-col sm:flex-row gap-3">
              <div id="image" className="w-1/5 min-w-24 ">
                <img className="w-full aspect-2/3 object-cover order-1 rounded-lg overflow-hidden" src={characterQ?.data.images?.jpg.image_url ?? null} alt="" />
              </div>

              <div id="about" className="order-2 w-full sm:w-4/5 pt-1 rounded-lg overflow-hidden box-colors">
                <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">About</div>
                <div className="p-3 text-xs font-light flex flex-col space-y-2">
                  <p className="whitespace-pre-wrap">{characterQ?.data.about || "No biography written."}</p>
                  <p>Member Favorites: {characterQ?.data.favorites}</p>
                </div>
              </div>
            </div>
            <div id="Pictures" className="order-3 box-colors rounded-md">
              <Pictures pictures={characterPicturesQ?.data} openGallery={openGallery} cols={3} />
            </div>
            <div className="order-4 flex flex-col md:flex-row gap-3">
              <div className="order-2 md:order-1 flex flex-col sm:flex-row gap-3 w-full md:w-1/2">
                <div id="Animeography" className="order-1 box-colors w-full sm:w-1/2 rounded-md h-fit">
                  <div className="border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-md/relaxed capitalize">Animeography</div>
                  <div className="flex flex-col pt-2 space-y-2">
                    {!characterQ?.data.anime.length ? (
                      <p className="p-3 text-xs font-light">No animeography found.</p>
                    ) : (
                      characterQ?.data.anime.map((anime) => (
                        <div key={anime.anime.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                          <Link className="w-1/4" to={`/anime/${anime.anime.mal_id}`}>
                            <img className="w-full aspect-3/4 object-cover" src={anime.anime.images.webp.image_url} alt={anime.anime.title} />
                          </Link>
                          <div className="flex flex-col w-3/4 space-y-1">
                            <Link to={`/anime/${anime.anime.mal_id}`}>
                              <p className="text-xs blue-link">{anime.anime.title}</p>
                            </Link>
                            <p className="text-2xs">{anime.role}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div id="Mangaography" className="order-2 box-colors w-full sm:w-1/2 rounded-md h-fit">
                  <div className="border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-md/relaxed capitalize">Mangaography</div>
                  <div className="flex flex-col pt-2 space-y-2">
                    {!characterQ?.data.manga.length ? (
                      <p className="p-3 text-xs font-light">No mangaography found.</p>
                    ) : (
                      characterQ?.data.manga.map((manga) => (
                        <div key={manga.manga.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                          <Link className="w-1/4" to={`/manga/${manga.manga.mal_id}`}>
                            <img className="w-full aspect-3/4 object-cover" src={manga.manga.images.webp.image_url} alt={manga.manga.title} />
                          </Link>
                          <div className="flex flex-col w-3/4 space-y-1">
                            <Link to={`/manga/${manga.manga.mal_id}`}>
                              <p className="text-xs blue-link">{manga.manga.title}</p>
                            </Link>
                            <p className="text-2xs">{manga.role}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 flex flex-col space-y-2 w-full md:w-1/2">
                <div id="Voices" className="box-colors rounded-md ">
                  <div className="border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-md/relaxed capitalize">Voice Actors</div>
                  <div className="grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 pt-2">
                    {!characterQ?.data.voices.length ? (
                      <p className="p-3 text-xs font-light">No voice actors found.</p>
                    ) : (
                      characterQ?.data.voices.map((voice) => (
                        <div key={voice.person.mal_id} className="w-full flex gap-1 px-2 border-b border-amethyst-smoke-400/20">
                          <Link className="w-1/4 aspect-2/3 " to={`/people/${voice.person.mal_id}`}>
                            <img className="w-full h-full object-cover" src={voice.person.images.jpg.image_url} alt={voice.person.name} />
                          </Link>
                          <div className="flex flex-col w-3/4 gap-1">
                            <Link className="text-xs blue-link" to={`/people/${voice.person.mal_id}`}>
                              {voice.person.name}
                            </Link>
                            <p className="text-2xs">{voice.language}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showModal && (
            <Gallery
              name={characterQ?.data.name}
              pictures={characterPicturesQ?.data}
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
