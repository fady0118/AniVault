import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function MangaPage() {
  let { id } = useParams();
  const [mangaData, setMangaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchManga() {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${id}/full`);
        const data = await response.json();
        setMangaData(data.data ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchManga();
  }, [id]);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 text-dark-amethyst-smoke-50 dark:text-text-dark">
          <div id="title" className="mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col">
            <span className="text-sm/relaxed sm:text-lg/relaxed">{mangaData.title}</span>
            <div className="flex items-center space-x-1.5">
                <span className="text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65">{mangaData.title_japanese}</span>
                <a className="w-7 sm:w-9 rounded-sm overflow-hidden" href={mangaData.url} target="_blank">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png"
                    alt="MyAnimeList Logo"
                    className="w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300"
                  />
                </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
