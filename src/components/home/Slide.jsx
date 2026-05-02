import { Play } from "lucide-react";
import { useState } from "react";
import TrailerModal from "./TrailerModal";
const gradientStyles = `bg-[linear-gradient(0deg,#e7e6ee_20%,#e7e6eea8_50%,transparent_65%)] dark:bg-[linear-gradient(0deg,#1b1e1f_20%,#1b1e1fab_50%,transparent_65%)] sm:bg-[linear-gradient(90deg,#e7e6ee_50%,#e7e6eea8_65%,transparent_100%)] sm:dark:bg-[linear-gradient(90deg,#1b1e1f_50%,#1b1e1fab_65%,transparent_100%)]`;

export default function Slide({ animeData, openModal }) {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  return (
    <>
      <div className={`relative slide w-full h-full flex justify-end items-center shrink-0 text-6xl `}>
        <div className="w-full h-full absolute top-0 left-0 "></div>
        <div className={`absolute z-20 top-0 left-0 w-full sm:w-4/5 md:w-2/3 h-full flex flex-col justify-end items-start ${gradientStyles}`}>
          <div className="w-full sm:w-[65%] box-border h-1/2 sm:h-2/3 flex flex-col space-y-3 sm:space-y-6 justify-start px-6">
            <div className="w-full text-xl sm:text-3xl font-extrabold">{animeData.title_english}</div>
            <div className="flex items-center space-x-2 text-xs">
              {animeData.demographics.length ? (
                <div id="demographics" className="flex space-x-1.5">
                  {animeData.demographics.map((demographic, i) => (
                    <div key={i} className="px-1 py-0.5 text-2xs font-semibold rounded-sm border border-rose-600 text-rose-600 dark:border-emerald-600 dark:text-emerald-600">
                      {demographic.name}
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
              <div id="type" className="flex space-x-1.5">
                <div className="font-extrabold">{animeData.type}</div>
              </div>
              <div id="genres" className="flex">
                {animeData.genres.map(({name})=>name).join(', ')}
              </div>
              <a className="w-8 sm:w-10 rounded-sm overflow-hidden" href={animeData.url} target="_blank">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                  alt="MyAnimeList Logo"
                  className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                />
              </a>
            </div>
            {animeData.synopsis && (
              <div id="synopsis" className="flex text-xs font-light max-h-1/6 overflow-y-hidden">
                {animeData.synopsis}
              </div>
            )}
            <div className="w-1/2 sm:w-3/4 lg:w-1/2 min-w-48 flex justify-center py-1.5 rounded-lg bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-200">
              <div className="flex justify-between text-2xs sm:text-xs w-[90%] px-5">
                <div className="flex-col space-y-0.5">
                  <div className="font-extralight">Score</div>
                  <div className="font-bold text-xs xs:text-md">{animeData.score}</div>
                </div>
                <div className="flex-col space-y-0.5">
                  <div className="font-extralight">Rank</div>
                  <div className="font-bold text-xs xs:text-md">{animeData.rank}</div>
                </div>
                <div className="flex-col space-y-0.5">
                  <div className="font-extralight">Year</div>
                  <div className="font-bold text-xs xs:text-md">{animeData.year}</div>
                </div>
              </div>
            </div>
            <div id="links" className="flex flex-col 2xs:flex-row justify-center items-start 2xs:justify-start 2xs:items-center w-full space-x-5 space-y-3 2xs:space-y-0">
              <div onClick={()=>{window.location.pathname=`anime/${animeData.mal_id}`}} className="flex justify-center items-center w-3/5 2xs:w-2/5 aspect-9/2 rounded-lg uppercase text-xs 2xs:text-sm font-semibold text-text-dark bg-mal-blue hover:cursor-pointer hover:brightness-125 hover:-translate-y-1 duration-300">
                More Details
              </div>
              <div
                onClick={()=>{openModal(animeData.trailer.embed_url)}}
                className="flex justify-center items-center space-x-2  w-3/5 2xs:w-2/5 aspect-9/2 rounded-lg uppercase text-xs 2xs:text-sm font-semibold border border-rose-600 text-rose-600 dark:border-emerald-600 dark:text-emerald-600 hover:cursor-pointer hover:brightness-125 hover:-translate-y-1 duration-300"
              >
                <Play size={18}/>
                <span>Trailer</span>
              </div>
            </div>
          </div>
        </div>
        <img className="min-h-screen w-full sm:w-2/3 aspect-auto object-top object-cover" src={animeData.images.jpg.large_image_url} alt={animeData.title} />
      </div>
     
    </>
  );
}

