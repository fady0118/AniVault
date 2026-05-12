import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Voice from "../components/person/Voice";
import { WindowContext } from "../App";
import CardBox from "../components/CardBox/CardBox";
import VoicesGrid from "../components/person/VoicesGrid";
import useGallery from "../utility/useGallery";
import Pictures from "../components/character/Pictures";
import Gallery from "../components/character/Gallery";
import { useQueries } from "@tanstack/react-query";

export default function PeoplePage() {
  const { id } = useParams();
  const { windowWidth } = useContext(WindowContext);

  const [personQ, picturesQ] = useQueries({
    queries: [
      {
        queryKey: ["person", id],
        queryFn: async () => {
          const res = await fetch(`https://api.jikan.moe/v4/people/${id}/full`);
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
          const res = await fetch(`https://api.jikan.moe/v4/people/${id}/pictures`);
          if (!res.ok) throw new Error(res.statusText);
          const pictures_Data = await res.json();
          return pictures_Data.data;
        },
      },
    ],
  });

  function dateFormatter(input) {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

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
              <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={personQ?.data.url} target="_blank">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                  alt="MyAnimeList Logo"
                  className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                />
              </a>
            </div>
            <div className="w-full order-2 flex flex-col sm:flex-row sm:justify-start gap-3">
              <div id="image" className="w-1/5 min-w-24 max-w-48 ">
                <img className="w-full aspect-2/3 object-cover order-1 rounded-lg overflow-hidden" src={personQ?.data.images.jpg.image_url} alt="" />
              </div>

              <div id="about" className="order-2 w-full pt-0.5  rounded-lg overflow-hidden box-colors">
                <div className="border-b border-amethyst-smoke-200/40 pt-0.5  px-3 font-semibold text-md/relaxed capitalize">About</div>
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
            <div id="vaRoles" className="order-3 pt-1 rounded-lg overflow-hidden box-colors">
              <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Voice Acting Roles</div>
              {windowWidth >= 480 ? <VoicesGrid voices={personQ?.data?.voices} /> : <CardBox dataArr={personQ?.data?.dataArr} />}
            </div>
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
