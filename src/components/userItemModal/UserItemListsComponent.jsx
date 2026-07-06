import { useState, useEffect } from "react";
import { tablesDB } from "../../appwrite";
import { ID, Permission, Query, Role } from "appwrite";
import { useAuth } from "../../Contexts/AuthContext";
import useFormStatusHandling from "./useFormStatusHandling";
import LoaderComponent from "../LoaderComponent";

export default function UserItemListsComponent({ jikanData, mediaType, userItemTableData }) {
  // auth state to get the user_id
  const { loggedInUser } = useAuth();
  // item data from list tables in the DB
  const [userListsData, setUserListsData] = useState(null);
  // add to custom-lists
  const [selectedLists, setSelectedLists] = useState({}); // { listId: { name, notes, is_public, is_item_public } } - lists user wants to add item to
  const [newList, setNewlist] = useState({ name: null, notes: null, is_public: false, is_item_public: false }); // holds the newList data, used in case the user adds the item to a new List

  // form status
  const { status, setStatus, error, setError } = useFormStatusHandling();

  // fetch the userlists from list table in the DB
  async function fetchUserListsFromDb() {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        queries: [Query.equal("user_id", loggedInUser.$id), Query.select(["*", "listItem_id.*"])],
      });
      console.log(res?.rows);
      if (res?.rows?.length) {
        // flatten the listItems extract mal_id
        const flattenedLists = Object.fromEntries((res?.rows ?? []).map(({ name, $id, listItem_id, is_public }) => [$id, { name, listItems: listItem_id.map((i) => Number(i.mal_id)), is_public }]));
        setUserListsData({ ...res, flattenedLists });
      }
    } catch (error) {
      console.log(error);
    }
  }
  // call fetchUserListsFromDb on component mount to populate userListsData state
  useEffect(() => {
    fetchUserListsFromDb();
  }, []);

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
    console.log({ itemId, img, title, mediaType, notes, listId, is_public, is_item_public });
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
          is_public: is_item_public,
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
      setStatus("loading");
      // call addItemToList for each selected list
      await Promise.all(
        Object.entries(selectedLists).map(([listId, { notes, is_public, is_item_public }]) =>
          addItemToList(
            jikanData?.mal_id ?? userItemTableData?.mal_id,
            jikanData?.images?.jpg?.image_url ?? jikanData?.images?.webp?.image_url ?? userItemTableData?.cached_img,
            jikanData?.title ?? userItemTableData?.title,
            mediaType,
            notes,
            listId,
            is_public,
            is_item_public,
          ),
        ),
      );
      if (newList?.name) {
        const newListRes = await createNewList(newList?.name, null, loggedInUser.$id, newList?.is_public);
        await addItemToList(
          jikanData?.mal_id ?? userItemTableData?.mal_id,
          jikanData?.images?.jpg?.image_url ?? jikanData?.images?.webp?.image_url ?? userItemTableData?.cached_img,
          jikanData?.title ?? userItemTableData?.title,
          mediaType,
          newList?.notes || null,
          newListRes.$id,
          newList?.is_public,
          newList?.is_item_public,
        );
      }
      // reset selectedLists && newList
      setSelectedLists({});
      setNewlist({ name: null, notes: null, is_public: false, is_item_public: false });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError(error.message);
      setSelectedLists({});
      setNewlist({ name: null, notes: null, is_public: false, is_item_public: false });
    }
  }

  useEffect(() => {
    if (!Object.keys(selectedLists).length && !newList?.name) return; // keep success or error status until a value change
    setStatus("modified"); // if a value changes update the state to idle
  }, [newList, selectedLists]);

  return (
    <section className="rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Add {jikanData?.title || userItemData?.title} to one of your custom lists</p>
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
                  const alreadyAdded = listItems?.includes(jikanData?.mal_id);
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
          {status === "idle" || status === "modified" ? (
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
                        <div className="flex flex-row items-center justify-between gap-1 flex-wrap">
                          <p className="text-sm font-medium text-amethyst-smoke-950 dark:text-amethyst-smoke-100">{newList?.name}</p>
                          <div className="flex items-center text-amethyst-smoke-400 gap-2 text-xs">
                            <p className="text-[0.9em] text-amethyst-smoke-800 dark:text-amethyst-smoke-600">Item privacy</p>
                            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-transparent text-amethyst-smoke-900 dark:text-amethyst-smoke-500">
                              <span className="w-10">{newList?.is_item_public ? "Public" : "Private"}</span>
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
                            </label>
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
                    disabled={status !== "modified"}
                    className="w-fit px-8 btn btn-sm btn-outline border-indigo-600/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/15 dark:hover:bg-indigo-600/30 capitalize"
                  >
                    update
                  </button>
                </>
              ) : (
                <button onClick={updateLists} disabled className="w-fit px-8 btn btn-sm btn-outline border-amethyst-smoke-600 text-amethyst-smoke-900/40 dark:text-amethyst-smoke-200/40 capitalize">
                  update
                </button>
              )}
            </>
          ) : (
            <>
              {status === "loading" ? (
                <div className="flex">
                  <div className="relative scale-75">
                    <LoaderComponent />
                  </div>
                </div>
              ) : (
                <>
                  {status === "success" ? (
                    <div role="alert" className="text-emerald-600 dark:text-emerald-400 rounded-sm px-1 py-0.5 text-xs">
                      <span>list updated successfully</span>
                    </div>
                  ) : (
                    <>
                      {error ? (
                        <div role="alert" className="text-rose-600 dark:text-rose-400 rounded-sm px-1 py-0.5 text-xs">
                          <span>{error}</span>
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
  );
}
