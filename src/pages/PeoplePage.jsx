import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Voice from "../components/person/Voice";
import { RootContext } from "../App";
import CardBox from "../components/CardBox/CardBox";
import VoicesGrid from "../components/person/VoicesGrid";
import useGallery from "../utility/useGallery";
import Pictures from "../components/character/Pictures";
import Gallery from "../components/character/Gallery";
import { useQueries } from "@tanstack/react-query";
import { dateFormatter } from "../utility/utils";
import { jikanFetch } from "../utility/jikanApi";

export default function PeoplePage() {
  const { id } = useParams();
  const { windowWidth } = useContext(RootContext);

  const [personQ, picturesQ] = useQueries({
    queries: [
      {
        queryKey: ["person", id],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/people/${id}/full`);
          if (!res.ok) throw new Error(res.statusText);
          const person_Data = await res.json();

          const dataArr = person_Data?.data?.voices.map(({ role, character, anime }) => ({
            character: { path: "character", role, ...character },
            anime: { path: "anime", role, ...anime },
          }));

          return { ...person_Data.data, dataArr };
        },
      },
      {
        queryKey: ["picture", id],
        queryFn: async () => {
          const res = await jikanFetch(`https://api.jikan.moe/v4/people/${id}/pictures`);
          if (!res.ok) throw new Error(res.statusText);
          const pictures_Data = await res.json();
          return pictures_Data.data ?? [];
        },
      },
    ],
  });

  const { dispatch, showModal, openGallery, closeGallery, activeIndex } = useGallery(picturesQ?.data ?? []);

  return (
    <>
      {personQ.isPending ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <>
          <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
            <div id="title" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex items-center space-x-2">
              <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{personQ?.data.name}</div>
              <Link className="w-7 sm:w-9 rounded-sm overflow-hidden" to={personQ?.data.url} target="_blank">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                  alt="MyAnimeList Logo"
                  className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                />
              </Link>
            </div>
            <div className="w-full order-2 flex flex-col sm:flex-row sm:justify-start gap-3">
              <div id="image" className="w-1/5 min-w-24 max-w-48 ">
                <img className="w-full aspect-2/3 object-cover order-1 rounded-lg overflow-hidden" src={personQ?.data?.images?.jpg?.image_url} alt="" />
              </div>

              <div id="about" className="w-full pt-0.5 rounded-lg overflow-hidden box-colors">
                <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">About</div>
                <div className="p-3 text-xs font-light whitespace-pre-wrap">
                  <p>Given name: {personQ?.data.given_name}</p>
                  <p>Family name: {personQ?.data.family_name}</p>
                  <p>Birthday: {dateFormatter(personQ?.data.birthday)}</p>
                  <p className="">{personQ?.data.about || "No biography written."}</p>
                </div>
              </div>
            </div>
            <div id="Pictures" className="order-3 box-colors rounded-md pt-0.5">
              <Pictures pictures={picturesQ?.data} openGallery={openGallery} cols={3} />
            </div>
            <div className="w-full order-4 flex flex-col md:flex-row gap-3">
              {personQ?.data?.manga?.length ? (
                <div id="manga" className="order-last pt-1 w-full md:w-1/2 rounded-lg overflow-hidden box-colors">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Mangaography</div>
                  <div className="pt-2 space-y-2 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 auto-rows-fr">
                    {personQ?.data.manga.map((manga) => (
                      <div key={manga.manga.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                        <Link className="w-1/4" to={`/manga/${manga.manga.mal_id}`}>
                          <img className="w-full h-full aspect-3/4 object-cover" src={manga.manga.images.webp.image_url} alt={manga.manga.title} />
                        </Link>
                        <div className="flex flex-col w-3/4 space-y-1">
                          <Link to={`/manga/${manga.manga.mal_id}`}>
                            <p className="text-xs blue-link">{manga.manga.title}</p>
                          </Link>
                          <p className="text-2xs">{manga.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {personQ?.data?.anime?.length ? (
                <div id="anime" className="order-last pt-1 w-full md:w-1/2 rounded-lg overflow-hidden box-colors">
                  <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Animeography</div>
                  <div className="pt-2 space-y-2 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 auto-rows-fr">
                    {personQ?.data.anime.map((anime) => (
                      <div key={anime.anime.mal_id} className="flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20">
                        <Link className="w-1/4" to={`/anime/${anime.anime.mal_id}`}>
                          <img className="w-full h-full aspect-3/4 object-cover" src={anime.anime.images.webp.image_url} alt={anime.anime.title} />
                        </Link>
                        <div className="flex flex-col w-3/4 space-y-1">
                          <Link to={`/anime/${anime.anime.mal_id}`}>
                            <p className="text-xs blue-link">{anime.anime.title}</p>
                          </Link>
                          <p className="text-2xs">{anime.position.split("add ")[1] || anime.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            {personQ?.data?.voices?.length ? (
              <div id="vaRoles" className="order-5 pt-1 rounded-lg overflow-hidden box-colors">
                <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Voice Acting Roles</div>
                {windowWidth >= 480 ? <VoicesGrid voices={personQ?.data?.voices} /> : <CardBox dataArr={personQ?.data?.dataArr} />}
              </div>
            ) : (
              ""
            )}
          </div>
          {showModal && (
            <Gallery
              name={personQ?.data.name}
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
