import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useUserItemModal } from "../../../components/userItemModal/useUserItemModal";
import { NotebookPen } from "lucide-react";
import UserItemModal from "../../../components/userItemModal/UserItemModal";

const animeTypes = ["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv_special"];
const statuses = { anime: ["all", "unwatched", "watching", "plan_to_watch", "completed", "dropped"], manga: ["all", "unread", "reading", "plan_to_read", "completed", "dropped"] };
export default function UserWatchList({ data }) {
  const [userItems, setUserItems] = useState(null); // orgainzed watchList items
  const [selectedTab, setSelectedTab] = useState("anime"); // anime, manga
  const [animeStatus, setAnimeStatus] = useState("all"); // all, unwatched, watching, plan to watch, completed, dropped
  const [mangaStatus, setMangaStatus] = useState("all"); // all, unread, reading, plan to read, completed, dropped

  const [updatedItemData, setUpdatedItemData] = useState(null);
  const { setShowUserItemModal, showUserItemModal } = useUserItemModal();

  useEffect(() => {
    const animeItems = data?.rows?.filter((item) => item.mediaType === "anime") ?? [];
    const mangaItems = data?.rows?.filter((item) => item.mediaType === "manga") ?? [];
    setUserItems({ animeItems, mangaItems });
  }, [data]);

  function handleTypeChange(e) {
    setSelectedTab(e.target.value);
  }
  function handleAnimeStatusChange(e) {
    setAnimeStatus(e.target.value);
  }
  function handleMangaStatusChange(e) {
    setMangaStatus(e.target.value);
  }
  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="tabs tabs-box gap-1 border-0 bg-transparent capitalize font-semibold w-fit text-sm">
          <input
            type="radio"
            name="selectedTab"
            className={`tab h-fit py-1.5 px-3 ${selectedTab === "anime" ? "text-text-dark  bg-indigo-500 hover:cursor-default" : "text-text-light dark:text-text-dark bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"} duration-200`}
            aria-label="Anime"
            value="anime"
            checked={selectedTab === "anime"}
            onChange={handleTypeChange}
          />
          <input
            type="radio"
            name="selectedTab"
            className={`tab h-fit py-1.5 px-3 ${selectedTab === "manga" ? "text-text-dark  bg-violet-500 hover:cursor-default" : "text-text-light dark:text-text-dark  bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"}`}
            aria-label="Manga"
            value="manga"
            checked={selectedTab === "manga"}
            onChange={handleTypeChange}
          />
        </div>

        <div>
          {data?.total ? (
            <>
              {selectedTab === "anime" ? (
                <>
                  <div id="animeStatuses" className="flex flex-row items-center">
                    <div className="tabs tabs-box gap-1 border-0 bg-transparent capitalize font-semibold w-fit ">
                      {statuses.anime.map((status, i) => (
                        <input
                          key={i}
                          type="radio"
                          name="animeStatus"
                          className={`tab h-fit py-1 px-2 text-xs ${animeStatus === status ? "text-text-dark  bg-indigo-500 hover:cursor-default" : "text-text-light dark:text-text-dark  bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"}`}
                          aria-label={status}
                          value={status}
                          checked={animeStatus === status}
                          onChange={handleAnimeStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid auto-rows-fr p-2 gap-2 grid-cols-1 3xs:grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9">
                    {userItems?.animeItems
                      ?.filter((item) => item.status === animeStatus || animeStatus === "all")
                      .map((item) => (
                        <GridItem key={item?.$id} item={item} setShowUserItemModal={setShowUserItemModal} setUpdatedItemData={setUpdatedItemData} />
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div id="mangaStatuses" className="flex flex-row items-center">
                    <div className="tabs tabs-box gap-1 border-0 bg-transparent capitalize font-semibold w-fit ">
                      {statuses.manga.map((status, i) => (
                        <input
                          key={i}
                          type="radio"
                          name="mangaStatus"
                          className={`tab h-fit py-1 px-2 text-xs ${mangaStatus === status ? "text-text-dark  bg-violet-500 hover:cursor-default" : "text-text-light dark:text-text-dark  bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"}`}
                          aria-label={status}
                          value={status}
                          checked={mangaStatus === status}
                          onChange={handleMangaStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid auto-rows-fr p-2 gap-2 grid-cols-1 3xs:grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9">
                    {userItems?.mangaItems
                      ?.filter((item) => item?.status === mangaStatus || mangaStatus === "all")
                      .map((item) => (
                        <GridItem key={item?.$id} item={item} setShowUserItemModal={setShowUserItemModal} setUpdatedItemData={setUpdatedItemData} />
                      ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p>Watchlist is empty</p>
          )}
        </div>
      </div>
      {showUserItemModal && <UserItemModal userItemTableData={updatedItemData} setShowUserItemModal={setShowUserItemModal} setUserItems={setUserItems} />}
    </>
  );
}

function GridItem({ item, setShowUserItemModal, setUpdatedItemData }) {
  return (
    <div className="group relative rounded-md overflow-hidden">
      <Link to={`/${item?.mediaType}/${item?.mal_id}`}>
        <img className="w-full h-full object-cover" src={item?.cached_img} alt={item?.title} />
      </Link>

      <div className="absolute bottom-0 left-0 translate-y-0 md:translate-y-full  group-hover:translate-y-0 w-full flex flex-row justify-center items-center box-colors-lighter duration-200">
        <button
          onClick={() => {
            setUpdatedItemData(item);
            setShowUserItemModal(true);
          }}
          className="btn btn-soft btn-primary my-8 border-0 bg-amethyst-smoke-300 hover:bg-indigo-500 font-bold capitalize"
        >
          update item
        </button>
      </div>
    </div>
  );
}
