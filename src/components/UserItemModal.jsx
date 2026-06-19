import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { tablesDB } from "../appwrite";
import { useAuth } from "../Contexts/AuthContext";
import { ID, Permission, Query, Role } from "appwrite";
import LoaderComponent from "./LoaderComponent";
import { CheckCircle, Circle } from "lucide-react";
import { RootContext } from "../App";
import { delay } from "../utility/utils";

const animeTypes = ["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv_special"];
const statusEnum = { anime: ["unwatched", "plan_to_watch", "watching", "completed", "dropped"], manga: ["unread", "plan_to_read", "reading", "completed", "dropped"] };
// data is passed from the caller component
export default function UserItemModal({ data, setShowUserItemModal, userItemTableData = undefined, setUserItems = undefined }) {
  const { windowWidth } = useContext(RootContext);
  // auth state to get the user_id
  const { loggedInUser } = useAuth();

  // item data from user_item table in the DB
  const [userItemData, setUserItemData] = useState(null);
  const [userListsData, setUserListsData] = useState(null);
  const [mediaType, setMediaType] = useState(userItemTableData?.media_type || (animeTypes.includes(data?.type?.toLowerCase()) ? "anime" : "manga"));

  // item form-states
  const [currentTab, setCurrentTab] = useState(1);
  const [itemStatus, setItemStatus] = useState(null); // unwatched, plan_to_watch, watching, completed, dropped
  const [progress, setProgress] = useState(null);
  const [mangaProgress, setMangaProgress] = useState({ vols: null, chaps: null });
  const [timesWatched, setTimesWatched] = useState(null);

  // form status
  const [status, setStatus] = useState("idle"); // idle, modified, loading, success, error
  const [error, setError] = useState(null); // error state

  // add to custom-lists
  const [selectedLists, setSelectedLists] = useState({}); // { listId: { name, notes, is_public, is_item_public } } - lists user wants to add item to
  const [newList, setNewlist] = useState({ name: null, notes: null, is_public: false, is_item_public: false }); // holds the newList data, used in case the user adds the item to a new List

  // lists-status states
  const [listsUpdateStatus, setListsUpdateStatus] = useState("idle"); // idle, modified, loading, success, error
  const [listsUpdateError, setListsUpdateError] = useState(null);

  // fetch the item data from user_item table in the DB
  async function fetchItemFromDb() {
    if (userItemTableData) return setUserItemData(userItemTableData);
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
        queries: [Query.equal("user_id", loggedInUser.$id), Query.equal("mal_id", data?.mal_id), Query.limit(1)],
      });
      setUserItemData(res?.rows[0]);
    } catch (error) {
      setError(error);
    }
  }
  async function fetchUserListsFromDb() {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        queries: [Query.equal("user_id", loggedInUser.$id), Query.select(["*", "listItem_id.*"])],
      });
      if (res?.rows?.length) {
        // flatten the listItems extract mal_id
        const flattenedLists = Object.fromEntries((res?.rows ?? []).map(({ name, $id, listItem_id, is_public }) => [$id, { name, listItems: listItem_id.map((i) => Number(i.mal_id)), is_public }]));
        setUserListsData({ ...res, flattenedLists });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // update data in the DB
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
            media_type: mediaType,
            mal_id: data?.mal_id,
            cached_img: data?.images?.jpg?.image_url,
            title: data?.title,
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

  // call fetchItemFromDb on component mount to populate userItemData state
  useEffect(() => {
    fetchItemFromDb();
    fetchUserListsFromDb();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowUserItemModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

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
  }, [userItemData, itemStatus, progress, timesWatched, mangaProgress]);

  useLayoutEffect(() => {
    const initialStatus = userItemData?.status ?? null;
    const initialProgress = userItemData?.progress ?? null;
    const initialTimesWatched = userItemData?.times_watched ?? null;
    const initialMangaVols = userItemData?.manga_vols ?? null;
    const initialMangaChaps = userItemData?.manga_chaps ?? null;

    const hasChanges =
      itemStatus != initialStatus || progress != initialProgress || timesWatched != initialTimesWatched || mangaProgress.vols != initialMangaVols || mangaProgress.chaps != initialMangaChaps;

    setStatus(hasChanges ? "modified" : "idle");
  }, [userItemData, itemStatus, progress, timesWatched, mangaProgress]);

  // create new row in list table
  async function createNewList(name, description = null, user_id, is_public = false) {
    // is the list public? private?? this will affect the permissions
    const permissions = is_public
      ? [Permission.read(Role.users()), Permission.update(Role.user(loggedInUser.$id)), Permission.delete(Role.user(loggedInUser.$id))]
      : [Permission.read(Role.user(loggedInUser.$id)), Permission.update(Role.user(loggedInUser.$id)), Permission.delete(Role.user(loggedInUser.$id))];
    try {
      const res = await tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: ID.unique(),
        data: { name, description, user_id, user_id_str: String(user_id), is_public },
        permissions,
      });
      setUserListsData((prevState) => {
        return {
          ...prevState,
          flattenedLists: {
            ...prevState?.flattenedLists,
            [res.$id]: {
              name,
            },
          },
        };
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  // create new row in item-list table
  async function addItemToList(itemId, img, title, mediaType, notes = null, listId, is_public = false, is_item_public = false) {
    const permissions = is_item_public
      ? [Permission.read(Role.users()), Permission.update(Role.user(loggedInUser.$id)), Permission.delete(Role.user(loggedInUser.$id))]
      : [Permission.read(Role.user(loggedInUser.$id)), Permission.update(Role.user(loggedInUser.$id)), Permission.delete(Role.user(loggedInUser.$id))];
    try {
      const res = await tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST_ITEM,
        rowId: ID.unique(),
        data: {
          mal_id: String(itemId),
          notes,
          cached_img: img,
          title,
          mediaType,
          userList_id: listId,
        },
        permissions,
      });
      // push new item to its list in userListsData
      setUserListsData((prevState) => {
        const listItems = prevState.flattenedLists[listId]?.listItems ?? [];
        // Deduplicate using Set, then add the new item
        const updatedItems = [...new Set([...listItems, itemId])];
        return {
          ...prevState,
          flattenedLists: {
            ...prevState.flattenedLists,
            [listId]: {
              ...prevState.flattenedLists[listId],
              listItems: updatedItems,
            },
          },
        };
      });
    } catch (error) {
      throw new Error(`failed to add ${title} to the list`);
    }
  }

  async function updateLists() {
    try {
      setListsUpdateStatus("loading");
      // call addItemToList for each selected list
      await Promise.all(
        Object.entries(selectedLists).map(([listId, { notes, is_public, is_item_public }]) =>
          addItemToList(data?.mal_id, data?.images?.jpg?.image_url, data?.title, mediaType, notes, listId, is_public, is_item_public),
        ),
      );
      if (newList?.name) {
        const newListRes = await createNewList(newList?.name, null, loggedInUser.$id, newList?.is_public);
        await addItemToList(data?.mal_id, data?.images?.jpg?.image_url, data?.title, mediaType, newList?.notes || null, newListRes.$id, newList?.is_public);
      }
      // reset selectedLists && newList
      setSelectedLists({});
      setNewlist({ name: null, notes: null, is_public: false, is_item_public: false });
      setListsUpdateStatus("success");
    } catch (error) {
      setListsUpdateStatus("error");
      setListsUpdateError(error.message);
      setSelectedLists({});
      setNewlist({ name: null, notes: null, is_public: false, is_item_public: false });
    }
  }

  useEffect(() => {
    if (!Object.keys(selectedLists).length && !newList?.name) return; // keep success or error status until a value change
    setListsUpdateStatus("modified"); // if a value changes update the state to idle
  }, [newList, selectedLists]);

  return (
    <div className="z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg">
      <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] sm:w-4/5 md:w-3/5 rounded-xl p-3 xs:p-4 max-h-[90vh] overflow-y-auto box-colors">
        <button
          onClick={() => setShowUserItemModal(false)}
          className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent"
          aria-label="Close authentication modal"
        >
          ✕
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center gap-2">
            <div role="tablist" className="tabs tabs-border w-full justify-start">
              <button onClick={() => setCurrentTab(1)} role="tab" className={`tab ${currentTab === 1 ? "tab-active text-indigo-500" : "text-text-light/50 dark:text-text-dark/50"}`}>
                Status
              </button>
              <button onClick={() => setCurrentTab(2)} role="tab" className={`tab ${currentTab === 2 ? "tab-active text-indigo-500" : "text-text-light/50 dark:text-text-dark/50"}`}>
                Lists
              </button>
            </div>
          </div>

          {currentTab === 1 && (
            <section className="rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row flex-wrap items-start gap-4">
                  <img src={userItemTableData?.cached_img || data?.images?.webp?.large_image_url || data?.images?.webp?.image_url} className="w-24 h-32 rounded-sm object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate">{data?.title}</p>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 mt-2 text-2xs font-medium ${mediaType === "anime" ? "text-indigo-500 dark:text-indigo-400 inset-ring inset-ring-indigo-500/50 dark:inset-ring-indigo-400/50" : "text-purple-500 dark:text-purple-400 inset-ring inset-ring-purple-500/50 dark:inset-ring-purple-400/50"}`}
                    >
                      {mediaType}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
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
                          <select id="progressList" className="select select-primary bg-transparent select-xs outline-0 w-fit" value={progress || ""} onChange={(e) => setProgress(e.target.value)}>
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
                              disabled={itemStatus !== "reading"}
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

                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={updateData} disabled={status !== "modified"} className="btn btn-primary btn-sm w-fit capitalize">
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
              </div>
            </section>
          )}

          {currentTab === 2 && (
            <section className="rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">Add {data?.title} to one of your custom lists</p>
                    <p className="text-xs text-amethyst-smoke-800 dark:text-amethyst-smoke-600">Select existing lists or create a new one.</p>
                  </div>
                  <span className="inline-flex items-center rounded-md px-2 py-1 text-2xs font-medium text-indigo-500 dark:text-indigo-400 inset-ring inset-ring-indigo-500/50 dark:inset-ring-indigo-400/50">
                    {Object.keys(userListsData?.flattenedLists ?? {}).length} total
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
                  <section className="rounded-2xl border border-white/10 p-3 bg-transparent">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">Choose existing lists</p>
                        <p className="text-xs text-amethyst-smoke-800 dark:text-amethyst-smoke-600">Select one or more lists to add this item.</p>
                      </div>
                    </div>
                    <div className="grid gap-2 max-h-52 overflow-y-auto pr-2">
                      {userListsData?.flattenedLists ? (
                        Object.entries(userListsData?.flattenedLists).map(([listId, { name, is_public, listItems }]) => {
                          const alreadyAdded = listItems?.includes(data?.mal_id);
                          const selected = listId in selectedLists;
                          return (
                            <label
                              key={listId}
                              htmlFor={`${listId}-list`}
                              className={`group grid rounded-2xl border p-2.5 transition ${alreadyAdded ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/5" : selected ? "border-primary/40 bg-primary/10 dark:bg-primary/5 hover:cursor-pointer" : "border-amethyst-smoke-800/20 dark:border-amethyst-smoke-600/20 bg-transparent hover:cursor-pointer hover:border-primary/50 hover:bg-primary-900/10"}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex flex-row items-end gap-1.5 text-xs">
                                  <p className="truncate font-medium text-amethyst-smoke-950 dark:text-amethyst-smoke-100">{name}</p>
                                  <p className="text-[0.85em] text-amethyst-smoke-800 dark:text-amethyst-smoke-600">{is_public ? "Public list" : "Private list"}</p>
                                </div>
                                <input
                                  id={`${listId}-list`}
                                  name={`${listId}-list`}
                                  type="checkbox"
                                  checked={alreadyAdded || selected}
                                  disabled={alreadyAdded}
                                  onChange={() => {
                                    if (alreadyAdded) return;
                                    setSelectedLists((prevState) => {
                                      if (listId in prevState) {
                                        const { [listId]: _, ...rest } = prevState;
                                        return rest;
                                      }
                                      return { ...prevState, [listId]: { name, is_public, notes: null, is_item_public: is_public } };
                                    });
                                  }}
                                  className="checkbox checkbox-primary scale-75"
                                />
                              </div>
                              {alreadyAdded ? (
                                <p className="text-2xs text-emerald-600 dark:text-emerald-300">Already contains this item.</p>
                              ) : (
                                <p className="text-2xs text-amethyst-smoke-800 dark:text-amethyst-smoke-600">Tap to add this item to the list.</p>
                              )}
                            </label>
                          );
                        })
                      ) : (
                        <div className="rounded-2xl border border-dashed border-amethyst-smoke-100/10 bg-transparent p-4 text-xs text-slate-600 dark:text-slate-400">
                          No custom lists yet. Use the panel on the right to create one.
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-amethyst-smoke-100/10 p-3 bg-transparent">
                    <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold">Create a new list</p>
                      <div className="flex items-center text-amethyst-smoke-400 gap-2 text-xs">
                        <p className="text-[0.9em] text-amethyst-smoke-800 dark:text-amethyst-smoke-600">List privacy</p>
                        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-transparent text-amethyst-smoke-900 dark:text-amethyst-smoke-500">
                          <span className="text-xs">{newList?.is_public ? "Public" : "Private"}</span>
                          <input
                            type="checkbox"
                            checked={newList?.is_public}
                            onChange={(e) => setNewlist((prev) => ({ ...prev, is_public: e.target.checked }))}
                            className="toggle toggle-primary toggle-xs bg-transparent not-checked:text-amethyst-smoke-600"
                          />
                        </label>
                      </div>
                    </div>
                    <input
                      value={newList?.name || ""}
                      onChange={(e) => setNewlist((prev) => ({ ...prev, name: e.target.value }))}
                      type="text"
                      name="newListName"
                      id="newListName"
                      placeholder="List name"
                      className="input input-primary input-xs bg-transparent px-3 py-2 mt-2 outline-0 w-full"
                    />
                  </section>
                </div>

                <div className="space-y-3 pt-3">
                  {listsUpdateStatus === "idle" || listsUpdateStatus === "modified" ? (
                    <>
                      {newList?.name || Object.keys(selectedLists).length ? (
                        <>
                          <div className="grid gap-3">
                            {Object.entries(selectedLists).map(([listId, { name, notes, is_item_public }]) => (
                              <div key={listId} className="rounded-2xl border border-amethyst-smoke-100/10 section-colors-medium p-3">
                                <div className="flex flex-row items-center justify-between gap-1 flex-wrap">
                                  <p className="text-sm font-medium text-amethyst-smoke-950 dark:text-amethyst-smoke-100">{name}</p>
                                  <div className="flex items-center text-amethyst-smoke-400 gap-2 text-xs">
                                    <p className="text-[0.9em] text-amethyst-smoke-800 dark:text-amethyst-smoke-600">Item privacy</p>
                                    <label className="flex cursor-pointer items-center gap-2 rounded-full bg-transparent text-amethyst-smoke-900 dark:text-amethyst-smoke-500">
                                      <span className="w-10">{is_item_public ? "Public" : "Private"}</span>
                                      <input
                                        className="toggle toggle-primary toggle-xs bg-transparent not-checked:text-amethyst-smoke-600"
                                        type="checkbox"
                                        checked={is_item_public}
                                        onChange={(e) => {
                                          setSelectedLists((prevState) => ({
                                            ...prevState,
                                            [listId]: { ...prevState[listId], is_item_public: e.target.checked },
                                          }));
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  name={`${name}-notes`}
                                  id={`${name}-notes`}
                                  placeholder="Why does this anime belong on this list?"
                                  className="input input-primary input-xs bg-transparent outline-0 px-2 py-2 mt-1 w-full"
                                  value={notes || ""}
                                  onChange={(e) => {
                                    setSelectedLists((prevState) => ({
                                      ...prevState,
                                      [listId]: { ...prevState[listId], notes: e.target.value },
                                    }));
                                  }}
                                />
                              </div>
                            ))}
                            {newList?.name ? (
                              <div className="rounded-2xl border border-amethyst-smoke-100/10 section-colors-medium p-3">
                                <div className="flex gap-1.5 flex-row items-center justify-between flex-wrap">
                                  <div>
                                    <p className="text-sm font-medium text-amethyst-smoke-950 dark:text-amethyst-smoke-100">{newList?.name}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-600 dark:text-slate-400">{newList?.is_item_public ? "Public" : "Private"}</span>
                                    <input
                                      className="toggle toggle-primary toggle-xs bg-transparent not-checked:text-amethyst-smoke-600"
                                      type="checkbox"
                                      checked={newList?.is_item_public}
                                      onChange={(e) => {
                                        setNewlist((prevState) => ({
                                          ...prevState,
                                          is_item_public: e.target.checked,
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  name={`${newList?.name}-notes`}
                                  id={`${newList?.name}-notes`}
                                  placeholder="Why does this anime belong on this list?"
                                  className="input input-primary input-xs bg-transparent outline-0 px-2 py-2 mt-2 w-full"
                                  value={newList?.notes || ""}
                                  onChange={(e) => {
                                    setNewlist((prevState) => ({ ...prevState, notes: e.target.value }));
                                  }}
                                />
                              </div>
                            ) : null}
                          </div>
                          <button
                            onClick={updateLists}
                            disabled={listsUpdateStatus!=="modified"}
                            className="w-fit px-8 btn btn-sm btn-outline border-indigo-600/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/15 dark:hover:bg-indigo-600/30  capitalize"
                          >
                            update
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={updateLists}
                          disabled
                          className="w-fit px-8 btn btn-sm btn-outline border-amethyst-smoke-600 text-amethyst-smoke-900/40 dark:text-amethyst-smoke-200/40 capitalize"
                        >
                          update
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {listsUpdateStatus === "loading" ? (
                        <div className="flex">
                          <div className="relative scale-75">
                            <LoaderComponent />
                          </div>
                        </div>
                      ) : (
                        <>
                          {listsUpdateStatus === "success" ? (
                            <div role="alert" className="text-emerald-600 dark:text-emerald-400 rounded-sm px-1 py-0.5 text-xs">
                              <span>list updated successfully</span>
                            </div>
                          ) : (
                            <>
                              {listsUpdateError ? (
                                <div role="alert" className="text-rose-600 dark:text-rose-400 rounded-sm px-1 py-0.5 text-xs">
                                  <span>{listsUpdateError}</span>
                                </div>
                              ) : null}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
