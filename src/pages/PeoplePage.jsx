import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Voice from "../components/person/Voice";
import { WindowContext } from "../App";
import CharacterCardBox from "../components/CardBox/CharacterCardBox";
import VoicesGrid from "../components/person/VoicesGrid";

export default function PeoplePage() {
  const { id } = useParams();
  const [personData, setPersonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { windowWidth } = useContext(WindowContext);

  useEffect(() => {
    async function fetchPerson() {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/people/${id}/full`);
        const data = await response.json();
        setPersonData(data.data ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPerson();
  }, [id]);

  function fateFormatter(input) {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  const dataArr = personData?.voices.map(({ role, character, anime }) => ({
    character: { path: "character", role, ...character },
    anime: { path: "anime", role, ...anime },
  }));

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 text-dark-amethyst-smoke-50 dark:text-text-dark">
          <div id="title" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex items-center space-x-2">
            <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{personData.name}</div>
            <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={personData.url} target="_blank">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                alt="MyAnimeList Logo"
                className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
              />
            </a>
          </div>
          <div className="w-full order-2 flex flex-col sm:flex-row sm:justify-start gap-3">
            <div id="image" className="w-1/5 min-w-24 max-w-48 ">
              <img className="w-full aspect-2/3 object-cover order-1 rounded-lg overflow-hidden" src={personData.images.jpg.image_url} alt="" />
            </div>

            <div id="about" className="order-2 w-full pt-2 rounded-lg overflow-hidden box-colors">
              <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">About</div>
              <div className="p-3 text-xs font-light whitespace-pre-wrap">
                <p>Given name: {personData.given_name}</p>
                <p>Family name: {personData.family_name}</p>
                <p>Birthday: {fateFormatter(personData.birthday)}</p>
                <p className="">{personData.about || "No biography written."}</p>
              </div>
            </div>
          </div>
          <div id="vaRoles" className="order-3 pt-2 rounded-lg overflow-hidden box-colors">
            <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Voice Acting Roles</div>
            {windowWidth >= 480 ? (
              <VoicesGrid voices={personData.voices} />
            ) : (
              <CharacterCardBox dataArr={dataArr} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
