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
export default function UserItemModal({ data, setShowUserItemModal }) {
  const { windowWidth } = useContext(RootContext);
  // auth state to get the user_id
  const { loggedInUser } = useAuth();

  // item data from user_item table in the DB
  const [itemData, setItemData] = useState(null);
  const [userListsData, setUserListsData] = useState(null);
  const [mediaType, setMediaType] = useState(animeTypes.includes(data?.type?.toLowerCase()) ? "anime" : "manga");

  // item form-states
  const [itemStatus, setItemStatus] = useState(null); // unwatched, plan_to_watch, watching, completed, dropped
  const [progress, setProgress] = useState(null);
  const [mangaProgress, setMangaProgress] = useState({ vols: null, chaps: null });
  const [timesWatched, setTimesWatched] = useState(null);

  // form status
  const [status, setStatus] = useState("idle"); // idle, modified, loading, success, error
  const [error, setError] = useState(null); // error state

  // add to custom-lists
  const [selectedLists, setSelectedLists] = useState({}); // { listId: { name, notes } } - lists user wants to add item to
  const [newList, setNewlist] = useState(""); // holds the newList input value, used in case the user adds the item to a new List
  const [newListNotes, setNewListNotes] = useState(null); // holds the newList notes value
  // lists-status states
  const [listsUpdateStatus, setListsUpdateStatus] = useState("idle"); // idle, loading, success, error
  const [listsUpdateError, setListsUpdateError] = useState(null);

  // fetch the item data from user_item table in the DB
  async function fetchItemFromDb() {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
        queries: [Query.equal("user_id", loggedInUser.$id), Query.equal("mal_id", data.mal_id), Query.limit(1)],
      });
      setItemData(res?.rows[0]);
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
        const flattenedLists = Object.fromEntries((res?.rows ?? []).map(({ name, $id, listItem_id }) => [$id, { name, listItems: listItem_id.map((i) => Number(i.mal_id)) }]));
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
      if (!itemData) {
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
            mal_id: data.mal_id,
            user_id: loggedInUser.$id,
            user_id_str: loggedInUser.$id,
          },
        });
      } else {
        // update existing row
        res = await tablesDB.updateRow({
          databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
          rowId: itemData.$id,
          data: {
            status: itemStatus,
            progress: Number(progress) || null,
            times_watched: Number(timesWatched) || null,
            manga_vols: Number(mangaProgress.vols) || null,
            manga_chaps: Number(mangaProgress.chaps) || null,
          },
        });
      }
      setItemData(res);
      await delay(300);
      setStatus("success");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  }

  // call fetchItemFromDb on component mount to populate itemData state
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
    if (!itemData) return;
    // update form states
    setItemStatus(itemData?.status);
    setProgress(itemData?.progress);
    setTimesWatched(itemData?.times_watched);
    setMangaProgress({ vols: itemData?.manga_vols, chaps: itemData?.manga_chaps });
  }, [itemData]);

  // reactions to user changing any form states
  useEffect(() => {
    switch (itemStatus) {
      case "unwatched":
        setProgress(null);
        setTimesWatched(null);
        break;
      case "completed":
        setTimesWatched((prevState) => prevState ?? 1);
        setProgress(data?.episodes);
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
  }, [itemData, itemStatus, progress, timesWatched, mangaProgress]);

  useLayoutEffect(() => {
    const initialStatus = itemData?.status ?? null;
    const initialProgress = itemData?.progress ?? null;
    const initialTimesWatched = itemData?.times_watched ?? null;
    const initialMangaVols = itemData?.manga_vols ?? null;
    const initialMangaChaps = itemData?.manga_chaps ?? null;

    const hasChanges =
      itemStatus != initialStatus || progress != initialProgress || timesWatched != initialTimesWatched || mangaProgress.vols != initialMangaVols || mangaProgress.chaps != initialMangaChaps;

    setStatus(hasChanges ? "modified" : "idle");
  }, [itemData, itemStatus, progress, timesWatched, mangaProgress]);

  // create new row in list table
  async function createNewList(name, description = null, user_id, is_public = false) {
    // is the list public? private?? this will affect the permissions
    try {
      const res = await tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: ID.unique(),
        data: { name, description, user_id, user_id_str: String(user_id), is_public },
        permissions: [Permission.read(Role.user(loggedInUser.$id)), Permission.update(Role.user(loggedInUser.$id)), Permission.delete(Role.user(loggedInUser.$id))],
      });
      setUserListsData((prevState) => {
        return {
          ...prevState,
          flattenedLists: {
            ...prevState.flattenedLists,
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
  async function addItemToList(itemId, img, title, mediaType, notes = null, listId) {
    // is the list public? private?? this will affect the permissions
    // public/private is an attribute of the list but will affect all its items in item-list
    // if public read permission is given to all users
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
        permissions: [Permission.read(Role.user(loggedInUser.$id)), Permission.update(Role.user(loggedInUser.$id)), Permission.delete(Role.user(loggedInUser.$id))],
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
      await Promise.all(Object.entries(selectedLists).map(([listId, { notes }]) => addItemToList(data.mal_id, data?.images?.jpg?.image_url, data?.title, mediaType, notes, listId)));
      if (newList) {
        const newListRes = await createNewList(newList, null, loggedInUser.$id, false);
        await addItemToList(data.mal_id, data?.images?.jpg?.image_url, data?.title, mediaType, newListNotes || null, newListRes.$id);
      }
      // reset selectedLists && newList
      setSelectedLists({});
      setNewlist("");
      setListsUpdateStatus("success");
    } catch (error) {
      setListsUpdateStatus("error");
      setListsUpdateError(error.message);
      setSelectedLists({});
      setNewlist("");
    }
  }

  useEffect(() => {
    if (!Object.keys(selectedLists).length && !newList) return; // keep success or error status until a value change
    setListsUpdateStatus("idle"); // if a value changes update the state to idle
  }, [newList, selectedLists]);

  return (
    <div className="z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg">
      <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] sm:w-4/5 md:w-3/5 lg:w-1/2 rounded-lg p-3 xs:p-4 box-colors-medium">
        <button onClick={() => setShowUserItemModal(false)} className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 bg-transparent" aria-label="Close authentication modal">
          ✕
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col 2xs:flex-row items-start  gap-3">
            <div className="flex flex-row items-start w-fit text-xs 3xs:text-sm">
              <img src={data.images.webp.large_image_url || data.images.webp.image_url} className="min-w-20 max-w-28 aspect-2/3 rounded-sm object-cover" alt="" />
              {windowWidth < 384 && (
                <div id="title" className="flex flex-col items-start gap-2 min-w-1/2 w-fit rounded-md px-1.5 py-0.5 ">
                  <p>{data?.title}</p>
                  <span
                    className={`inline-flex items-center rounded-md bg-indigo-400/10 px-1 py-0.5 text-2xs font-medium ${mediaType === "anime" ? "text-indigo-400 inset-ring inset-ring-indigo-400/30" : "text-purple-400 inset-ring inset-ring-purple-400/30"}`}
                  >
                    {mediaType}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {windowWidth >= 384 && (
                <div id="title" className="flex flex-row flex-wrap items-end gap-2 min-w-1/2 w-fit rounded-md px-1.5 py-0.5 text-sm">
                  <p>{data?.title}</p>
                  <span
                    className={`inline-flex items-center rounded-md bg-indigo-400/10 px-1 py-0.5 text-2xs font-medium ${mediaType === "anime" ? "text-indigo-400 inset-ring inset-ring-indigo-400/30" : "text-purple-400 inset-ring inset-ring-purple-400/30"}`}
                  >
                    {mediaType}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <select name="statusList" id="statusList" className="select select-primary bg-transparent select-xs outline-0 w-fit" value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
                  <option disabled={true}>Set status</option>
                  {data?.status?.toLowerCase() === "not yet aired"
                    ? statusEnum[mediaType].slice(0, 2).map((str, i) => (
                        <option key={i} className="capitallize" value={str}>
                          {str}
                        </option>
                      ))
                    : statusEnum[mediaType].map((str, i) => (
                        <option key={i} className="capitallize" value={str}>
                          {str}
                        </option>
                      ))}
                </select>
                {itemStatus && itemStatus !== "unwatched" && itemStatus !== "plan_to_watch" && itemStatus !== "unread" && itemStatus !== "plan_to_read" && (
                  <>
                    {(itemStatus === "watching" || itemStatus === "dropped") && mediaType === "anime" && (
                      <>
                        <select
                          name="progressList"
                          id="progressList"
                          className="select select-primary bg-transparent select-xs outline-0 w-fit"
                          value={progress}
                          onChange={(e) => setProgress(e.target.value)}
                          disabled={itemStatus !== "watching" && itemStatus !== "dropped"}
                        >
                          <option disabled={true}>Set progress</option>
                          {Array.from({ length: data?.episodes }, (_, i) => i).map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    {(itemStatus === "reading" || itemStatus === "dropped") && mediaType === "manga" && (
                      <>
                        <select
                          name="volList"
                          id="volList"
                          className="select select-primary bg-transparent select-xs outline-0 w-fit"
                          value={mangaProgress.vols}
                          onChange={(e) => setMangaProgress((prevState) => ({ ...prevState, vols: e.target.value }))}
                          disabled={itemStatus !== "reading" && itemStatus !== "dropped"}
                        >
                          <option disabled={true}>Set volumes</option>
                          {Array.from({ length: data?.volumes }, (_, i) => i).map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select
                          name="chapsList"
                          id="chapsList"
                          className="select select-primary bg-transparent select-xs outline-0 w-fit"
                          value={mangaProgress.chaps}
                          onChange={(e) => setMangaProgress((prevState) => ({ ...prevState, chaps: e.target.value }))}
                          disabled={itemStatus !== "reading"}
                        >
                          <option disabled={true}>Set chapters</option>
                          {Array.from({ length: data?.chapters }, (_, i) => i).map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    {itemStatus === "completed" && mediaType === "anime" && (
                      <>
                        <select
                          name="timesWatchedList"
                          id="timesWatchedList"
                          className="select select-primary bg-transparent select-xs outline-0 w-fit"
                          value={timesWatched}
                          onChange={(e) => setTimesWatched(e.target.value)}
                        >
                          <option disabled={true}>Set times watched</option>
                          {Array.from({ length: 99 }, (_, i) => i).map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}X
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </>
                )}
              </div>
              {status === "modified" && (
                <button onClick={updateData} className="btn btn-primary btn-sm w-fit capitalize ">
                  update
                </button>
              )}

              {status === "loading" && (
                <div className="flex">
                  <div className="relative scale-75">
                    <LoaderComponent />
                  </div>
                </div>
              )}
              {status === "success" && (
                <div role="alert" className="text-emerald-600 dark:text-emerald-400 rounded-sm px-1 py-0.5 text-xs">
                  <span>status updated successfully</span>
                </div>
              )}
              {status === "error" && (
                <div role="alert" className="text-rose-600 dark:text-rose-400 rounded-sm px-1 py-0.5 text-xs">
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-md">
            <p className="font-light text-[0.75em]">Add {data?.title} to one of your custom lists </p>
            <p className="uppercase font-semibold">{loggedInUser.name}'s Lists</p>
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-y-2">
              <ul className="grid grid-cols-2 col-span-2 gap-y-0.5 list text-[0.8em]">
                {userListsData?.flattenedLists && (
                  <>
                    {Object.entries(userListsData?.flattenedLists).map(([listId, { name, listItems }]) => {
                      return (
                        <>
                          {listItems?.includes(data.mal_id) ? (
                            <label htmlFor={`${name}-list`} className="flex flex-row items-center gap-x-1 ">
                              {name}
                              <input name={`${name}-list`} key={name} type="checkbox" checked readOnly className="checkbox scale-65" />
                            </label>
                          ) : (
                            <label htmlFor={`${name}-list`} className="flex flex-row items-center gap-x-1">
                              {name}
                              <input
                                name={`${name}-list`}
                                key={name}
                                type="checkbox"
                                checked={listId in selectedLists}
                                onChange={() => {
                                  setSelectedLists((prevState) => {
                                    if (listId in prevState) {
                                      const { [listId]: _, ...rest } = prevState;
                                      return rest;
                                    } else {
                                      return { ...prevState, [listId]: { name, notes: null } };
                                    }
                                  });
                                }}
                                className="checkbox checkbox-primary scale-65"
                              />
                            </label>
                          )}
                        </>
                      );
                    })}
                  </>
                )}
              </ul>
              <div className="text-[0.8em]">
                <div className="flex flex-row items-center flex-wrap gap-2">
                  <p>New List</p>
                  <input
                    value={newList}
                    onChange={(e) => {
                      setNewlist(e.target.value);
                    }}
                    type="text"
                    name="newListName"
                    id="newListName"
                    className="input input-primary bg-transparent text-[1em] h-fit px-1 py-0.5 outline-0 w-2/3 min-w-24 max-w-48"
                  />
                </div>
              </div>
            </div>
            {listsUpdateStatus === "idle" ? (
              <>
                {newList || Object.keys(selectedLists).length ? (
                  <>
                    <div className="flex flex-col gap-y-1">
                      {Object.entries(selectedLists)?.map(([listId, { name, notes }]) => (
                        <div key={listId} className="w-full flex flex-col 2xs:flex-row items-start 2xs:items-center justify-between text-2xs">
                          <p>{name}</p>
                          <input
                            type="text"
                            name={`${name}-notes`}
                            id={`${name}-notes`}
                            placeholder="Why does this anime belong on this list?"
                            className="input input-primary input-xs bg-transparent outline-0 px-1 w-3/4 text-3xs xs:text-2xs"
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
                      {
                        newList?
                        <div className="w-full flex flex-col 2xs:flex-row items-start 2xs:items-center justify-between text-2xs">
                          <p>{newList}</p>
                          <input
                            type="text"
                            name={`${newList}-notes`}
                            id={`${newList}-notes`}
                            placeholder="Why does this anime belong on this list?"
                            className="input input-primary input-xs bg-transparent outline-0 px-1 w-3/4 text-3xs xs:text-2xs"
                            value={newListNotes || ""}
                            onChange={(e) => {
                              setNewListNotes(e.target.value);
                            }}
                          />
                        </div>:""
                      }
                    </div>

                    <button onClick={updateLists} className="btn btn-primary btn-sm w-fit capitalize">
                      update
                    </button>
                  </>
                ) : (
                  <button disabled className="btn btn-sm w-fit capitalize">
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
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
