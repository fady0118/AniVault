import { Eye, EyeOff } from "lucide-react";
import LoaderComponent from "../../../components/LoaderComponent";
import { Link } from "react-router";
import EmptyDataFallback from "../../../components/EmptyDataFallback";
import { tablesDB } from "../../../appwrite";
import { useEffect, useState } from "react";
import { Query } from "appwrite";
import { delay } from "../../../utility/utils";
import { useListUpdateDeleteModal } from "./ListModals/useListUpdateDeleteModal";
import ListUpdateModal from "./ListModals/ListUpdateModal";
import ListDeleteModal from "./ListModals/ListDeleteModal";

export default function UserCustomListComp({ loggedInUser, id, state }) {
  const [list, setList] = useState(null);
  const [pageStatus, setPageStatus] = useState("idle");
  const [listItemToModify, setListItemToModify] = useState(null);
  const [showListItemUpdateModal, setShowListItemUpdateModal] = useState(false);
  const [showListItemDeleteModal, setShowListItemDeleteModal] = useState(false);

  const {
    updateRef,
    updateList,
    handleDelete,
    showUpdateModal,
    setShowUpdateModal,
    showDeleteModal,
    setShowDeleteModal,
    status,
    setStatus,
    name,
    setName,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    isChanged,
    setIsChanged,
    error,
    setError,
    resetStates,
  } = useListUpdateDeleteModal(setList);

  async function fetchListFromDb() {
    setPageStatus("loading");
    try {
      const res = await tablesDB.getRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: id,
        queries: [Query.select(["*", "listItem_id.*"])],
      });
      setList(res);
      setPageStatus("idle");
    } catch (error) {
      setPageStatus("error");
    }
  }
  useEffect(() => {
    if (!list) return;
    updateRef(list);
  }, [list]);

  useEffect(() => {
    fetchListFromDb();
  }, [id]);

  const handleEditList = () => {
    setShowUpdateModal(true);
    setShowDeleteModal(false);
  };

  const handleDeleteList = () => {
    setShowDeleteModal(true);
    setShowUpdateModal(false);
  };

  return (
    <>
      <div className="relative w-full flex flex-col gap-4 text-text-light dark:text-text-dark">
        {pageStatus === "loading" ? (
          <div className="w-full py-10">
            <LoaderComponent />
          </div>
        ) : list ? (
          <>
            <div className="flex flex-col gap-3 rounded-lg box-colors p-3 border border-dark-amethyst-smoke-400/20 dark:border-amethyst-smoke-500/20 shadow-sm">
              <div className="flex flex-col items-start justify-between gap-0.5 text-sm">
                <div className="flex flex-row gap-3 justify-start w-full">
                  <div className="relative w-36 h-28 shrink-0">
                    {(() => {
                      const items = list?.listItem_id?.slice(0, 3) ?? [];
                      const padded = [...items, ...Array(Math.max(0, 3 - items.length)).fill(null)];
                      const containerW = 144;
                      const cardW = containerW * 0.52;
                      const step = (containerW - cardW) / 2;

                      return padded.map((item, i) =>
                        item ? (
                          <img
                            key={item.$id}
                            style={{
                              left: `${i * step}px`,
                              zIndex: 3 - i,
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-[52%] aspect-3/4 object-cover rounded-sm shadow-[15px_5px_15px_#1e2122cb] dark:shadow-[15px_5px_15px_#1e2122f0] transform-[rotate3d(1,10,0,45deg)] duration-200"
                            src={item.cached_img}
                            alt={list?.name}
                          />
                        ) : (
                          <div
                            key={`placeholder-${i}`}
                            style={{
                              left: `${i * step}px`,
                              zIndex: 3 - i,
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-[52%] aspect-3/4 rounded-sm shadow-[15px_5px_15px_#1e212282] dark:shadow-[15px_5px_15px_#1e2122f0] transform-[rotate3d(1,10,0,45deg)] duration-200 bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-300"
                          />
                        ),
                      );
                    })()}
                  </div>
                  <div className="flex flex-col w-full h-fit">
                    <div className="w-full flex flex-wrap grow items-start justify-between h-fit gap-y-1">
                      <h1 className="text-[1.35em] font-semibold">{list?.name}</h1>
                      <div className="text-[0.9em] text-text-light/70 dark:text-text-dark/70">
                        {list?.is_public ? (
                          <div className="flex flex-row items-center gap-1">
                            <Eye size={14} /> Public list
                          </div>
                        ) : (
                          <div className="flex flex-row items-center gap-1">
                            <EyeOff size={14} /> Private list
                          </div>
                        )}
                      </div>
                    </div>
                    {list?.description ? <p className="text-[0.9em] text-text-light/80 dark:text-text-dark/80 mt-1">{list?.description}</p> : null}
                    <p className="text-[0.9em] text-text-light/75 dark:text-text-dark/75">
                      {list?.listItem_id?.length} item{list?.listItem_id?.length !== 1 ? "s" : ""}
                    </p>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      id="buttons"
                      className="flex flex-row gap-2.5 py-2 w-fit hover:cursor-default"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditList();
                        }}
                        className="btn btn-sm btn-outline border-indigo-500/50 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 capitalize"
                      >
                        edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteList();
                        }}
                        className="btn btn-sm btn-primary bg-indigo-500 hover:bg-indigo-600 border-0 capitalize"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {list?.listItem_id?.length ? (
              <div className="grid grid-cols-1 gap-4">
                {list?.listItem_id?.map((item) => (
                  <Link
                    key={item.$id || item.mal_id}
                    to={`/${item.mediaType || "anime"}/${item.mal_id}`}
                    className="relative w-full group flex flex-row text-md md:text-lg overflow-hidden rounded-md border border-amethyst-smoke-500/20 bg-amethyst-smoke-500/5 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-indigo-500/10 hover:shadow-md"
                  >
                    <div className="w-1/10 min-w-20 max-w-32 aspect-3/4 bg-amethyst-smoke-200/80">
                      <img src={item?.cached_img} alt={item?.title} className="h-full w-full object-cover transition duration-200 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-row flex-wrap justify-between grow items-start px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <h2 className="text-[1em] font-semibold">{item?.title || "Untitled"}</h2>
                        <p className="text-[0.8em] text-text-light/70 dark:text-text-dark/70">{item?.notes || ""}</p>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          id="buttons"
                          className="flex flex-row gap-2.5 py-2 w-fit hover:cursor-default"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setListItemToModify(item);
                              setShowListItemUpdateModal(true);
                            }}
                            className="btn btn-sm btn-outline border-indigo-500/50 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 capitalize"
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setListItemToModify(item);
                              setShowListItemDeleteModal(true);
                            }}
                            className="btn btn-sm btn-primary bg-indigo-500 hover:bg-indigo-600 border-0 capitalize"
                          >
                            delete
                          </button>
                        </div>
                      </div>
                      <div className="text-[0.65em] text-text-light/70 dark:text-text-dark/70">
                        {item?.is_public ? (
                          <div className="flex flex-row items-center gap-1">
                            <Eye size={14} /> Public item
                          </div>
                        ) : (
                          <div className="flex flex-row items-center gap-1">
                            <EyeOff size={14} /> Private item
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-10">
                <EmptyDataFallback string="no items in this list" />
              </div>
            )}
          </>
        ) : (
          pageStatus === "error" && (
            <div className="">
              <EmptyDataFallback string="list doesn't exist or is set private by the owner" />
            </div>
          )
        )}
      </div>
      {/* List modals */}
      {showUpdateModal && (
        <ListUpdateModal
          setShowUpdateModal={setShowUpdateModal}
          updateList={updateList}
          status={status}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          isChanged={isChanged}
          error={error}
          resetStates={resetStates}
        />
      )}
      {showDeleteModal && <ListDeleteModal name={name} setShowDeleteModal={setShowDeleteModal} status={status} handleDelete={handleDelete} error={error} resetStates={resetStates} />}

      {/* List Items modals */}
      {showListItemUpdateModal && (
        <ListItemUpdateModal listItem={listItemToModify} setListItemToModify={setListItemToModify} setShowListItemUpdateModal={setShowListItemUpdateModal} setList={setList} />
      )}
      {showListItemDeleteModal && <ListItemDeleteModal listItem={listItemToModify} setShowListItemDeleteModal={setShowListItemDeleteModal} setList={setList} />}
    </>
  );
}

function ListItemUpdateModal({ listItem, setListItemToModify, setShowListItemUpdateModal, setList }) {
  const [isPublic, setIsPublic] = useState(listItem?.is_public || false);
  const [notes, setNotes] = useState(listItem?.notes || "");
  const [isChanged, setIsChanged] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [error, setError] = useState(null);

  // Track changes
  useEffect(() => {
    const hasChanges = isPublic !== listItem?.is_public || notes !== listItem?.notes;
    setIsChanged(hasChanges);
    return setStatus("idle");
  }, [isPublic, notes]);

  // close modal by pressing esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowListItemUpdateModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, [setShowListItemUpdateModal]);

  async function updateList() {
    setStatus("loading");
    try {
      const res = await tablesDB.updateRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST_ITEM,
        rowId: listItem.$id,
        data: { notes, is_public: isPublic },
      });
      const updatedListItem = { ...listItem, notes, is_public: isPublic };
      setListItemToModify(updatedListItem);
      setList((prevState) => ({ ...prevState, listItem_id: [updatedListItem, ...prevState?.listItem_id?.filter((item) => item?.$id !== listItem?.$id)] }));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError(error.message);
    }
  }

  return (
    <>
      <div className="z-50 fixed inset-0 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg">
        <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] max-w-lg rounded-lg border border-amethyst-smoke-600/20 box-colors p-3 xs:p-5 overflow-y-auto box-colors-semi-medium max-h-[90vh]">
          <button onClick={() => setShowListItemUpdateModal(false)} className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent" aria-label="Close modal">
            ✕
          </button>
          <div className="flex flex-col w-full gap-4 text-xs">
            <h2 className="text-[1.5em] font-semibold text-text-light/85 dark:text-text-dark/85 mt-1">Edit "{listItem?.title || "this item"}"</h2>

            {/* Item Image */}
            <img className="w-1/5 min-w-24 max-w-32 object-cover aspect-2/3 rounded-md" src={listItem?.cached_img} alt={listItem?.title} />

            {/* Error Message */}
            {error && (
              <div className="alert alert-error text-xs">
                <span>{error}</span>
              </div>
            )}

            {/* Privacy Toggle */}
            <label className="flex flex-wrap cursor-pointer items-center gap-2 rounded-full bg-transparent text-amethyst-smoke-900 dark:text-amethyst-smoke-500">
              <div className="w-auto">
                {isPublic ? (
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {listItem?.is_public ? "Keep this item public" : "Make this item public"}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <EyeOff size={14} />
                    {!listItem?.is_public ? "Keep this item private" : "Make this item private"}
                  </div>
                )}
              </div>
              <input
                className="toggle toggle-primary toggle-xs bg-transparent not-checked:text-amethyst-smoke-600"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </label>
            {/* Notes Textarea */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text text-text-light/85 dark:text-text-dark/85">Notes</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this item..."
                className="textarea textarea-bordered bg-amethyst-smoke-400/10 border-amethyst-smoke-500/30 text-text-light dark:text-text-dark placeholder-text-light/40 dark:placeholder-text-dark/40 text-sm resize-none"
                rows="4"
                disabled={status === "loading"}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row flex-wrap items-center gap-4 pt-2">
              <button onClick={updateList} disabled={!isChanged || status === "loading"} className="btn btn-sm btn-primary bg-indigo-500 hover:bg-indigo-600 border-0 capitalize">
                Update
              </button>
              {status === "loading" ? (
                <div className="scale-65">
                  <LoaderComponent />
                </div>
              ) : status === "success" ? (
                <p className="text-emerald-500 dark:text-emerald-400 capitalize">item updated successfully</p>
              ) : (
                <p className="text-rose-500 dark:text-rose-400 capitalize">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ListItemDeleteModal({ listItem, setShowListItemDeleteModal, setList }) {
  const [status, setStatus] = useState("idle"); // idle, loading,success, error
  const [error, setError] = useState(null);

  // delete listItem function
  async function handleDelete() {
    try {
      setStatus("loading");
      await tablesDB.deleteRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST_ITEM,
        rowId: listItem.$id,
      });
      setList((prevState) => ({ ...prevState, listItem_id: [...prevState?.listItem_id?.filter((item) => item?.$id !== listItem?.$id)] }));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      return setError("failed to delete list");
    }
  }
  // close modal by pressing esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowListItemDeleteModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg flex items-center justify-center p-4 text-md">
        <div className="fixed w-full max-w-lg rounded-lg border border-amethyst-smoke-600/20 shadow-2xl shadow-slate-950/40 px-6 py-4 box-colors-semi-medium">
          <button
            onClick={() => setShowListItemDeleteModal(false)}
            className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent"
            aria-label="Close delete confirmation modal"
          >
            ✕
          </button>
          <div className="flex flex-col gap-4">
            {status === "success" ? (
              <div className="flex flex-col justify-start gap-3 w-full">
                <p className="text-emerald-500 dark:text-emerald-400 capitalize">list deleted successfully</p>
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => setShowListItemDeleteModal(false)}
                    className="btn btn-sm btn-outline px-6 border-amethyst-smoke-600/80 text-amethyst-smoke-900 dark:text-amethyst-smoke-200 hover:bg-amethyst-smoke-600/20 dark:hover:bg-amethyst-smoke-500/20 duration-200 text-[0.85em] capitalize w-full sm:w-auto"
                  >
                    return
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-semibold text-text-light/85 dark:text-text-dark/85 mt-1">Delete "{listItem?.title || "this list"}"?</h2>
                  <p className="mt-2 text-sm text-text-light/70 dark:text-text-dark/70">This action cannot be undone. The list and any saved metadata will be permanently removed.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {status !== "loading" ? (
                    <button
                      onClick={handleDelete}
                      className="btn btn-sm btn-outline border-rose-500/80 text-rose-600 dark:text-rose-300 hover:bg-rose-400/20 dark:hover:bg-rose-600/20 duration-200 text-[0.85em] capitalize w-full sm:w-auto"
                    >
                      Confirm delete
                    </button>
                  ) : (
                    <div className="scale-75">
                      <LoaderComponent />
                    </div>
                  )}
                  <button
                    onClick={() => setShowListItemDeleteModal(false)}
                    className="btn btn-sm btn-outline border-amethyst-smoke-600/80 text-amethyst-smoke-900 dark:text-amethyst-smoke-200 hover:bg-amethyst-smoke-600/20 dark:hover:bg-amethyst-smoke-500/20 duration-200 text-[0.85em] capitalize w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {status === "error" && <p className="text-rose-500 dark:text-rose-400 capitalize">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
