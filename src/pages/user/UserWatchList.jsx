import { Query } from "appwrite";
import { tablesDB } from "../../appwrite";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import ItemUpdateModal from "./ItemUpdateModal";

const statuses = { anime: ["all", "unwatched", "watching", "plan_to_watch", "completed", "dropped"], manga: ["all", "unread", "reading", "plan_to_read", "completed", "dropped"] };
export default function UserWatchList({ user }) {
  const [animeItems, setAnimeItems] = useState(null);
  const [mangaItems, setMangaItems] = useState(null);
  const [selectedTab, setSelectedTab] = useState("anime"); // anime, manga
  const [animeStatus, setAnimeStatus] = useState("all"); // all, unwatched, watching, plan to watch, completed, dropped
  const [mangaStatus, setMangaStatus] = useState("all"); // all, unread, reading, plan to read, completed, dropped
  const [showItemUpdateModal, setShowItemUpdateModal] = useState(false);
  const [updatedItemData, setUpdatedItemData] = useState(null);
  async function fetchUserItems() {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
        queries: [Query.equal("user_id", user.$id)],
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      const res = await fetchUserItems();
      const animeItems = res?.rows?.filter((item) => item.media_type === "anime");
      const mangaItems = res?.rows?.filter((item) => item.media_type === "manga");
      setAnimeItems(animeItems);
      setMangaItems(mangaItems);
    })();
  }, []);

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
        <div className="box-colors rounded-md w-fit min-w-1/2 border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">User watch list</div>
        <div class="tabs tabs-box gap-1 border-0 bg-transparent capitalize font-semibold w-fit text-sm">
          <input
            type="radio"
            name="selectedTab"
            class={`tab h-fit py-1.5 px-3 ${selectedTab === "anime" ? "text-text-dark  bg-indigo-500 hover:cursor-default" : "text-text-light dark:text-text-dark bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"} duration-200`}
            aria-label="Anime"
            value="anime"
            checked={selectedTab === "anime"}
            onChange={handleTypeChange}
          />
          <input
            type="radio"
            name="selectedTab"
            class={`tab h-fit py-1.5 px-3 ${selectedTab === "manga" ? "text-text-dark  bg-violet-500 hover:cursor-default" : "text-text-light dark:text-text-dark  bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"}`}
            aria-label="Manga"
            value="manga"
            checked={selectedTab === "manga"}
            onChange={handleTypeChange}
          />
        </div>

        <div>
          {selectedTab === "anime" ? (
            <>
              <div id="animeStatuses" className="flex flex-row items-center">
                <div class="tabs tabs-box gap-1 border-0 bg-transparent capitalize font-semibold w-fit ">
                  {statuses.anime.map((status, i) => (
                    <input
                      key={i}
                      type="radio"
                      name="animeStatus"
                      class={`tab h-fit py-1 px-2 text-xs ${animeStatus === status ? "text-text-dark  bg-indigo-500 hover:cursor-default" : "text-text-light dark:text-text-dark  bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"}`}
                      aria-label={status}
                      value={status}
                      checked={animeStatus === status}
                      onChange={handleAnimeStatusChange}
                    />
                  ))}
                </div>
              </div>
              <div className="grid auto-rows-fr p-2 gap-2 grid-cols-1 3xs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                {animeItems
                  ?.filter((item) => item.status === animeStatus || animeStatus === "all")
                  .map((item) => (
                    <GridItem key={item?.$id} item={item} setShowItemUpdateModal={setShowItemUpdateModal} setUpdatedItemData={setUpdatedItemData} />
                  ))}
              </div>
            </>
          ) : (
            <>
              <div id="mangaStatuses" className="flex flex-row items-center">
                <div class="tabs tabs-box gap-1 border-0 bg-transparent capitalize font-semibold w-fit ">
                  {statuses.manga.map((status, i) => (
                    <input
                      key={i}
                      type="radio"
                      name="mangaStatus"
                      class={`tab h-fit py-1 px-2 text-xs ${mangaStatus === status ? "text-text-dark  bg-violet-500 hover:cursor-default" : "text-text-light dark:text-text-dark  bg-amethyst-smoke-600/30 hover:bg-amethyst-smoke-500/30"}`}
                      aria-label={status}
                      value={status}
                      checked={mangaStatus === status}
                      onChange={handleMangaStatusChange}
                    />
                  ))}
                </div>
              </div>
              <div className="grid auto-rows-fr p-2 gap-2 grid-cols-1 3xs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                {mangaItems
                  ?.filter((item) => item?.status === mangaStatus || mangaStatus === "all")
                  .map((item) => (
                    <GridItem key={item?.$id} item={item} setShowItemUpdateModal={setShowItemUpdateModal} setUpdatedItemData={setUpdatedItemData} />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      {showItemUpdateModal && <ItemUpdateModal data={updatedItemData} setShowItemUpdateModal={setShowItemUpdateModal} />}
    </>
  );
}

function GridItem({ item, setShowItemUpdateModal, setUpdatedItemData }) {
  return (
    <div className="group relative rounded-md overflow-hidden">
      <Link to={`/${item?.media_type}/${item?.mal_id}`}>
        <img className="w-full h-full object-cover" src={item?.cached_img} alt={item?.title} />
      </Link>
      <div className="absolute bottom-0 left-0 translate-y-full group-hover:translate-y-0 w-full flex flex-row justify-center items-center box-colors-lighter duration-200">
        <button
          onClick={() => {
            setUpdatedItemData(item);
            setShowItemUpdateModal(true);
          }}
          className="btn btn-soft btn-primary my-8 border-0 bg-amethyst-smoke-300 hover:bg-indigo-500 font-bold capitalize"
        >
          update item
        </button>
      </div>
    </div>
  );
}
