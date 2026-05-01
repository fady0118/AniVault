export default function Slide({ animeData }) {
  const gradientStyles = `bg-[linear-gradient(0deg,#e7e6ee_20%,#e7e6eea8_50%,transparent_65%)] dark:bg-[linear-gradient(0deg,#1b1e1f_20%,#1b1e1fab_50%,transparent_65%)] sm:bg-[linear-gradient(90deg,#e7e6ee_50%,#e7e6eea8_65%,transparent_100%)] sm:dark:bg-[linear-gradient(90deg,#1b1e1f_50%,#1b1e1fab_65%,transparent_100%)]`;
  return (
    <>
      <div className={`relative slide w-full h-full flex justify-end items-center shrink-0 text-6xl `}>
        <div className="w-full h-full absolute top-0 left-0 "></div>
        <div className={`absolute z-20 top-0 left-0 w-full sm:w-2/3 h-full flex flex-col justify-end items-start ${gradientStyles}`}>
          <div className="w-full sm:w-[60%] box-border h-1/2 sm:h-2/3 flex flex-col space-y-6 justify-start px-6">
            <div className="w-full text-xl sm:text-3xl font-extrabold">{animeData.title_english}</div>
            <div className="flex items-center space-x-2 text-xs">
              {animeData.demographics.length ? (
                <div id="demographics" className="flex space-x-1.5">
                  {animeData.demographics.map((demographic, i) => (
                    <div key={i} className="px-1 py-0.5 text-2xs rounded-sm border border-rose-500 text-rose-500">
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
                {animeData.genres.map((obj) => obj.name).reduce((acc, current) => acc + ", " + current)}
              </div>
            </div>
            {animeData.synopsis && (
              <div id="synopsis" className="flex text-xs font-light max-h-1/6 overflow-y-hidden">
                {animeData.synopsis}
              </div>
            )}
            <div className="w-2/3 flex justify-center py-1.5 rounded-lg bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-200">
              <div className="flex justify-between text-xs w-[90%] px-5">
                <div className="flex-col space-y-0.5">
                  <div className="font-extralight">Score</div>
                  <div className="font-bold text-md">{animeData.score}</div>
                </div>
                <div className="flex-col space-y-0.5">
                  <div className="font-extralight">Rank</div>
                  <div className="font-bold text-md">{animeData.rank}</div>
                </div>
                <div className="flex-col space-y-0.5">
                  <div className="font-extralight">Year</div>
                  <div className="font-bold text-md">{animeData.year}</div>
                </div>
              </div>
            </div>
            <div id="links" className="flex items-center space-x-5">
              <div className="w-2/5 aspect-9/2 flex justify-center items-center uppercase text-md rounded-lg text-text-dark bg-mal-blue hover:cursor-pointer hover:brightness-125 duration-300">
                More Details
              </div>
              <a className="w-8 sm:w-10 rounded-sm overflow-hidden" href={animeData.url} target="_blank">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                  alt="MyAnimeList Logo"
                  className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                />
              </a>
            </div>
          </div>
        </div>
        <img className="min-h-screen w-full sm:w-2/3 aspect-auto object-top object-cover" src={animeData.images.jpg.large_image_url} alt={animeData.title} />
      </div>
    </>
  );
}
