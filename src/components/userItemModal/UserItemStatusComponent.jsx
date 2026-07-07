import { useState, useEffect, useLayoutEffect } from "react";
import { tablesDB } from "../../appwrite";
import { ID, Query } from "appwrite";
import useFormStatusHandling from "./useFormStatusHandling";
import { useAuth } from "../../Contexts/AuthContext";
import LoaderComponent from "../LoaderComponent";
import { delay } from "../../utility/utils";

const statusEnum = { anime: ["unwatched", "plan_to_watch", "watching", "completed", "dropped"], manga: ["unread", "plan_to_read", "reading", "completed", "dropped"] };
export default function UserItemStatusComponent({ jikanData, mediaType, setMediaType, setUserItems, userItemData, setUserItemData }) {
  // auth state to get the user_id
  const { loggedInUser } = useAuth();
  // item form-states
  const [itemStatus, setItemStatus] = useState(null); // unwatched, plan_to_watch, watching, completed, dropped
  const [progress, setProgress] = useState(null);
  const [mangaProgress, setMangaProgress] = useState({ vols: null, chaps: null });
  const [timesWatched, setTimesWatched] = useState(null);

  // form status
  const { status, setStatus, error, setError } = useFormStatusHandling();

  // update userItem data in the DB
  async function updateData() {
    setStatus("loading");
    let res;
    try {
      if (!userItemData) {
        // create new row
        res = await tablesDB.createRow({
          databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
          rowId: ID.unique(),
          data: {
            status: itemStatus,
            progress: Number(progress) || null,
            times_watched: Number(timesWatched) || null,
            manga_vols: Number(mangaProgress.vols) || null,
            manga_chaps: Number(mangaProgress.chaps) || null,
            mediaType: mediaType,
            mal_id: jikanData?.mal_id ?? userItemData?.mal_id,
            cached_img: jikanData?.images?.jpg?.image_url ?? jikanData?.images?.webp?.image_url ?? userItemData?.cached_img,
            title: jikanData?.title ?? userItemData?.title,
            user_id: loggedInUser?.$id,
            user_id_str: loggedInUser?.$id,
          },
        });
      } else {
        // update existing row
        res = await tablesDB.updateRow({
          databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
          rowId: userItemData?.$id,
          data: {
            status: itemStatus,
            progress: Number(progress) || null,
            times_watched: Number(timesWatched) || null,
            manga_vols: Number(mangaProgress.vols) || null,
            manga_chaps: Number(mangaProgress.chaps) || null,
          },
        });
      }
      setUserItemData(res);
      if (setUserItems) {
        setUserItems((prevState) => {
          const animeItems = prevState?.animeItems ?? [];
          const mangaItems = prevState?.mangaItems ?? [];
          return mediaType === "anime"
            ? {
                mangaItems,
                animeItems: [res, ...animeItems.filter((item) => item?.mal_id !== res?.mal_id)],
              }
            : {
                animeItems,
                mangaItems: [res, ...mangaItems.filter((item) => item?.mal_id !== res?.mal_id)],
              };
        });
      }
      await delay(300);
      setStatus("success");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  }



  // sync form states with fetched data
  useEffect(() => {
    if (!userItemData) return;
    // update form states
    setItemStatus(userItemData?.status);
    setProgress(userItemData?.progress);
    setTimesWatched(userItemData?.times_watched);
    setMangaProgress({ vols: userItemData?.manga_vols, chaps: userItemData?.manga_chaps });
  }, [userItemData]);

  // reactions to user changing any form states
  useEffect(() => {
    switch (itemStatus) {
      case "unwatched":
        setProgress(null);
        setTimesWatched(null);
        break;
      case "completed":
        setTimesWatched((prevState) => prevState ?? 1);
        setProgress(jikanData?.episodes ?? null);
        break;
      case "plan_to_watch":
        setProgress(null);
        setTimesWatched(null);
        break;
      case "watching":
        setTimesWatched(null);
        break;
      case "dropped":
        setTimesWatched(null);
        break;
    }
  }, [itemStatus, jikanData]);

  // update form status when the user makes changes
  useLayoutEffect(() => {
    // if (!userItemData) return;
    const initialStatus = userItemData?.status ?? null;
    const initialProgress = userItemData?.progress ?? null;
    const initialTimesWatched = userItemData?.times_watched ?? null;
    const initialMangaVols = userItemData?.manga_vols ?? null;
    const initialMangaChaps = userItemData?.manga_chaps ?? null;
    const hasChanges =
      itemStatus != initialStatus || progress != initialProgress || timesWatched != initialTimesWatched || mangaProgress?.vols != initialMangaVols || mangaProgress?.chaps != initialMangaChaps;
console.log({hasChanges})
    setStatus(hasChanges ? "modified" : "idle");
  }, [userItemData, itemStatus, progress, timesWatched, mangaProgress]);

  return (
    <>
      <section className="rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row flex-wrap items-start gap-4">
            <img
              src={userItemData?.cached_img || jikanData?.images?.webp?.large_image_url || jikanData?.images?.webp?.image_url}
              className="w-24 h-32 rounded-sm object-cover"
              alt={jikanData?.title || userItemData?.title}
            />
            <div className="flex flex-col items-start gap-4 grow">
              <div className="flex flex-row flex-wrap items-center gap-x-1.5 min-w-0">
                <p className="font-bold text-sm sm:text-lg truncate">{jikanData?.title || userItemData?.title}</p>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-2xs font-medium ${mediaType === "anime" ? "text-indigo-500 dark:text-indigo-400 inset-ring inset-ring-indigo-500/50 dark:inset-ring-indigo-400/50" : "text-purple-500 dark:text-purple-400 inset-ring inset-ring-purple-500/50 dark:inset-ring-purple-400/50"}`}
                >
                  {mediaType}
                </span>
              </div>

              <div className="grid gap-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="statusList" className="text-sm font-medium">
                    Status
                  </label>
                  <select id="statusList" className="select select-primary bg-transparent select-xs outline-0 w-fit" value={itemStatus || ""} onChange={(e) => setItemStatus(e.target.value)}>
                    <option disabled value="">
                      Select status
                    </option>
                    {jikanData?.status?.toLowerCase() === "not yet aired"
                      ? statusEnum[mediaType].slice(0, 2).map((str, i) => (
                          <option key={i} value={str}>
                            {str}
                          </option>
                        ))
                      : statusEnum[mediaType].map((str, i) => (
                          <option key={i} value={str}>
                            {str}
                          </option>
                        ))}
                  </select>
                </div>

                {itemStatus && itemStatus !== "unwatched" && itemStatus !== "plan_to_watch" && itemStatus !== "unread" && itemStatus !== "plan_to_read" && (
                  <div className="grid gap-3">
                    {(itemStatus === "watching" || itemStatus === "dropped") && mediaType === "anime" && (
                      <div className="flex flex-wrap items-center gap-3">
                        <label htmlFor="progressList" className="text-sm font-medium">
                          Episode progress
                        </label>
                        <select id="progressList" className="select select-primary bg-transparent select-xs outline-0 w-fit" value={progress || ""} onChange={(e) => setProgress(e.target.value)}>
                          <option disabled value="">
                            Set progress
                          </option>
                          {Array.from({ length: Number(jikanData?.episodes ?? null) || 0 }, (_, i) => i + 1).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {(itemStatus === "reading" || itemStatus === "dropped") && mediaType === "manga" && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <label htmlFor="volList" className="text-sm font-medium">
                            Volumes
                          </label>
                          <select
                            id="volList"
                            className="select select-primary bg-transparent select-xs outline-0 w-fit"
                            value={mangaProgress.vols || ""}
                            onChange={(e) => setMangaProgress((prev) => ({ ...prev, vols: e.target.value }))}
                          >
                            <option disabled value="">
                              Set volumes
                            </option>
                            {Array.from({ length: Number(jikanData?.volumes ?? null) || 0 }, (_, i) => i + 1).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <label htmlFor="chapsList" className="text-sm font-medium">
                            Chapters
                          </label>
                          <select
                            id="chapsList"
                            className="select select-primary bg-transparent select-xs outline-0 w-fit"
                            value={mangaProgress.chaps || ""}
                            onChange={(e) => setMangaProgress((prev) => ({ ...prev, chaps: e.target.value }))}
                          >
                            <option disabled value="">
                              Set chapters
                            </option>
                            {Array.from({ length: Number(jikanData?.chapters ?? null) || 0 }, (_, i) => i + 1).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {itemStatus === "completed" && mediaType === "anime" && (
                      <div className="flex flex-wrap items-center gap-3">
                        <label htmlFor="timesWatchedList" className="text-sm font-medium">
                          Times watched
                        </label>
                        <select
                          id="timesWatchedList"
                          className="select select-primary bg-transparent select-xs outline-0 w-fit"
                          value={timesWatched || ""}
                          onChange={(e) => setTimesWatched(e.target.value)}
                        >
                          <option disabled value="">
                            Set times watched
                          </option>
                          {Array.from({ length: 99 }, (_, i) => i + 1).map((value) => (
                            <option key={value} value={value}>
                              {value}X
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={updateData}
                    disabled={status !== "modified"}
                    className={`w-fit px-8 btn btn-sm btn-outline  capitalize ${status !== "modified" ? "border-amethyst-smoke-600 text-amethyst-smoke-900/40 dark:text-amethyst-smoke-200/40" : "border-indigo-600/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/15 dark:hover:bg-indigo-600/30"}`}
                  >
                    update
                  </button>
                  {status === "loading" && (
                    <div className="flex">
                      <div className="relative scale-75">
                        <LoaderComponent />
                      </div>
                    </div>
                  )}
                  {status === "success" && <span className="text-emerald-600 dark:text-emerald-400 text-xs">status updated successfully</span>}
                  {status === "error" && <span className="text-rose-600 dark:text-rose-400 text-xs">{error}</span>}
                </div>
        </div>
      </section>
    </>
  );
}
