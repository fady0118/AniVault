import { useEffect, useState } from "react";
import { tablesDB } from "../appwrite";
import { Query } from "appwrite";
import { useAuth } from "../Contexts/AuthContext";
import TextAreaToolBox from "./textareaToolbox/TextAreaToolBox";
import useTextAreaToolBox from "./textareaToolbox/useTextAreaToolBox";

const animeTypes = ["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv special"];
const statusEnum = { anime: ["unwatched", "plan_to_watch", "watching", "completed", "dropped"], manga: ["unread", "plan_to_read", "reading", "completed", "dropped"] };
export default function ReviewsModal({ setShowReviewsModal, data }) {
  const { loggedInUser } = useAuth();
  // data local states
  const [reviewData, setReviewData] = useState(null);
  const [userItemData, setUserItemData] = useState(null);
  // layout tab switch state
  const [currentTab, setCurrentTab] = useState(1);
  // local input states
  const [itemStatus, setItemStatus] = useState(null);
  const [progress, setProgress] = useState(null);
  const [mangaProgress, setMangaProgress] = useState({ vols: null, chaps: null });
  const [timesWatched, setTimesWatched] = useState(null);
  // status handling
  const [status, setStatus] = useState("idle"); // posting review status
  const [error, setError] = useState(null);

  // review body TextArea
  const { textAreaData, setTextAreaData, insertTextStyle } = useTextAreaToolBox(reviewData?.review_body||"")
  // derive mediaType from item data
  const mediaType = animeTypes.includes(data?.type?.toLowerCase()) ? "anime" : "manga";

  // appwrite data fetch
  async function fetchReviewFromDB() {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
        queries: [Query.equal("item_mal_id", data?.mal_id), Query.equal("userProfile", loggedInUser?.$id)],
      });
      setReviewData(res?.rows[0] || null);
    } catch (error) {
      // console.log(error);
      setStatus(error);
      setError(error.message);
    }
  }
  async function fetchUserItemFromDB() {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
        queries: [Query.equal("mal_id", data?.mal_id), Query.equal("user_id", loggedInUser?.$id)],
      });
      setUserItemData(res?.rows[0] || null);
    } catch (error) {
      // console.log(error);
      setStatus(error);
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchReviewFromDB();
    fetchUserItemFromDB();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowReviewsModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  // update local states with reviewData
  useEffect(() => {
    if (!userItemData) return;
    setItemStatus(userItemData?.status || null);
    if (mediaType === "anime") {
      setProgress(userItemData?.progress || null);
    } else {
      setMangaProgress({ vols: userItemData?.manga_vols || null, chaps: userItemData?.manga_chaps || null });
    }
    setTimesWatched(userItemData?.times_watched || null);
  }, [userItemData]);

  // local states reactions to user changes
  useEffect(() => {
    switch (itemStatus) {
      case "unwatched":
        setProgress(null);
        setTimesWatched(null);
        break;
      case "completed":
        setTimesWatched((prevState) => prevState ?? 1);
        setProgress(data?.episodes ?? null);
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
  }, [itemStatus, progress, timesWatched, mangaProgress]);

  return (
    <div className="z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg">
      <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] sm:w-4/5 md:w-3/5 rounded-xl px-4 py-2  max-h-[90vh] overflow-y-auto box-colors">
        <button
          onClick={() => setShowReviewsModal(false)}
          className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent"
          aria-label="Close authentication modal"
        >
          ✕
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center gap-2">
            <div role="tablist" className="tabs tabs-border w-full justify-start">
              <button onClick={() => setCurrentTab(1)} role="tab" className={`tab ${currentTab === 1 ? "tab-active text-indigo-500" : "text-text-light/50 dark:text-text-dark/50"}`}>
                Status
              </button>
              <button onClick={() => setCurrentTab(2)} role="tab" className={`tab ${currentTab === 2 ? "tab-active text-indigo-500" : "text-text-light/50 dark:text-text-dark/50"}`}>
                Review
              </button>
            </div>
          </div>

          <>
            {currentTab === 1 && (
              <section className="rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30">
                <div className="flex flex-col">
                  <div className="flex flex-row flex-wrap items-start gap-4">
                    <img src={data?.images?.webp?.large_image_url || data?.images?.webp?.image_url} className="w-24 h-32 rounded-sm object-cover" alt={data?.title} />
                    <div className="flex flex-col items-start gap-4 grow">
                      <div className="flex flex-row flex-wrap items-center gap-x-1.5 min-w-0">
                        <p className="font-bold text-sm sm:text-lg truncate">{data?.title}</p>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-2xs font-medium ${mediaType === "anime" ? "text-indigo-500 dark:text-indigo-400 inset-ring inset-ring-indigo-500/50 dark:inset-ring-indigo-400/50" : "text-purple-500 dark:text-purple-400 inset-ring inset-ring-purple-500/50 dark:inset-ring-purple-400/50"}`}
                        >
                          {mediaType}
                        </span>
                      </div>
                      {/* <div className="w-full min-h-24 bg-rose-500"></div> */}
                      <div className="grid gap-2.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <label htmlFor="statusList" className="text-sm font-medium">
                            Status
                          </label>
                          <select id="statusList" className="select select-primary bg-transparent select-xs outline-0 w-fit" value={itemStatus || ""} onChange={(e) => setItemStatus(e.target.value)}>
                            <option disabled value="">
                              Select status
                            </option>
                            {data?.status?.toLowerCase() === "not yet aired"
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
                                <select
                                  id="progressList"
                                  className="select select-primary bg-transparent select-xs outline-0 w-fit"
                                  value={progress || ""}
                                  onChange={(e) => setProgress(e.target.value)}
                                >
                                  <option disabled value="">
                                    Set progress
                                  </option>
                                  {Array.from({ length: Number(data?.episodes ?? null) || 0 }, (_, i) => i + 1).map((value) => (
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
                                    {Array.from({ length: Number(data?.volumes ?? null) || 0 }, (_, i) => i + 1).map((value) => (
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
                                    {Array.from({ length: Number(data?.chapters ?? null) || 0 }, (_, i) => i + 1).map((value) => (
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
                </div>
              </section>
            )}
            {currentTab === 2 && (
              <section className="rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30">
                <div className="w-full grid grid-cols-1 xs:grid-cols-3 min-h-36">
                  <div id="reviewBody" className="col-span-1 xs:col-span-2 bg-rose-500">
                    <TextAreaToolBox textAreaData={textAreaData} setTextAreaData={setTextAreaData} insertTextStyle={insertTextStyle} />
                  </div>
                  <div id="reviewMeta" className="col-span-1 bg-emerald-500"></div>
                </div>
              </section>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
