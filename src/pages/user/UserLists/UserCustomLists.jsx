import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { tablesDB } from "../../../appwrite";
import LoaderComponent from "../../../components/LoaderComponent";

export default function UserCustomLists({ data }) {
  const [filteredLists, setFilteredLists] = useState(data?.rows ?? []);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToModify, setListToModify] = useState(null);
  const navigate = useNavigate();

  const handleEditList = (list) => {
    setListToModify(list);
    setShowEditModal(true);
    setShowDeleteModal(false);
  };

  const handleDeleteList = (list) => {
    setListToModify(list);
    setShowDeleteModal(true);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-4">
        {filteredLists?.map((list) => (
          <Link
            to={`userList/${list?.$id}`}
            state={{ list }}
            key={list?.$id}
            className="w-full flex flex-row flex-wrap items-start gap-4 p-4 rounded-lg bg-amethyst-smoke-400/80 dark:bg-dark-amethyst-smoke-200/80 border border-amethyst-smoke-600/30 hover:bg-indigo-500/10 hover:cursor-pointer hover:shadow-[0px_5px_10px_#4f39f64d] duration-200"
          >
            <div className="relative w-1/10 min-w-32 max-w-48 mr-4 aspect-7/6 shrink-0">
              {list?.listItem_id?.slice(0, 3)?.map((item, i) => (
                <img
                  key={item?.$id}
                  style={{ transformStyle: "preserve-3d", left: `calc(${Math.floor((i / 3) * 100)}%)` }}
                  className={`absolute top-1/2 -translate-y-1/2 w-1/2 aspect-2/3 z-${10 * (2 - i)} object-cover transform-[rotate3d(1,10,0,45deg)] shadow-[7px_3px_12px_#1e2122] duration-200`}
                  src={item?.cached_img}
                  alt={list?.name}
                />
              ))}
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{list?.name}</h3>
                {list?.description && <p className="text-[0.8em] max-lines-2 cutoff-text-abs text-text-light/70 dark:text-text-dark/70">{list?.description}</p>}
                <p className="text-xs text-text-light/80 dark:text-text-dark/80">
                  {list?.listItem_id?.length || 0} item{list?.listItem_id?.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                id="buttons"
                className="flex flex-row gap-2.5 py-2 w-fit hover:cursor-default"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditList(list);
                  }}
                  className="btn btn-sm btn-outline border-indigo-500/50 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 capitalize"
                >
                  edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list);
                  }}
                  className="btn btn-sm btn-primary bg-indigo-500 hover:bg-indigo-600 border-0 capitalize"
                >
                  delete
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {showEditModal && <ListEditModal list={listToModify} setListToModify={setListToModify} setShowEditModal={setShowEditModal} setFilteredLists={setFilteredLists} />}
      {showDeleteModal && <ListDeleteModal list={listToModify} setShowDeleteModal={setShowDeleteModal} />}
    </>
  );
}

function ListEditModal({ list, setListToModify, setShowEditModal, setFilteredLists }) {
  const [name, setName] = useState(list?.name);
  const [description, setDescription] = useState(list?.description);
  const [isPublic, setIsPublic] = useState(list?.is_public);
  const [isChanged, setIsChanged] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [error, setError] = useState(null);

  // close modal by pressing esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEditModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  // update isChanged state
  useEffect(() => {
    if (name !== list?.name || description !== list?.description || isPublic !== list?.is_public) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
    return setStatus("idle");
  }, [name, description, isPublic]);

  // update list function
  async function updateList() {
    setStatus("loading");
    try {
      const res = await tablesDB.updateRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: list.$id,
        data: { name, description, is_public: isPublic },
      });
      setListToModify(res);
      setFilteredLists((prevState) => [res, ...prevState.filter((list) => list.$id !== res.$id)]);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      return setError("failed to update list");
    }
  }
  return (
    <>
      <div className="z-50 fixed inset-0 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg">
        <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] max-w-lg rounded-lg border border-amethyst-smoke-600/20 box-colors p-3 xs:p-5 overflow-y-auto box-colors-semi-medium">
          <button onClick={() => setShowEditModal(false)} className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent" aria-label="Close authentication modal">
            ✕
          </button>
          <div className="flex flex-col w-full gap-2 text-xs">
            <h2 className="text-2xl font-semibold text-text-light/85 dark:text-text-dark/85 mt-1">Edit "{list?.name || "this list"}"</h2>

            <label htmlFor="listName" className="w-fit min-w-3/4 flex flex-col gap-0.5 text-[1em]">
              <p className="w-fit text-text-light/65 dark:text-text-dark/65 text-[1.2em]">List Name</p>
              <input
                type="text"
                name="listName"
                id="listName"
                className="w-full p-2 h-fit input bg-transparent border-text-light/25 dark:border-text-dark/25 outline-0 text-[1.1em]"
                value={name}
                onChange={(e) => {
                  if (status === "loading") return;
                  setName(e.target.value);
                }}
              />
            </label>
            <label htmlFor="listDescription" className="w-fit min-w-3/4 flex flex-col gap-0.5 text-[1em]">
              <p className="w-fit text-text-light/65 dark:text-text-dark/65 text-[1.2em]">List Description</p>
              <input
                type="text"
                name="listDescription"
                id="listDescription"
                className="w-full p-2 h-fit input bg-transparent border-text-light/25 dark:border-text-dark/25 outline-0 text-[1.1em]"
                value={description}
                onChange={(e) => {
                  if (status === "loading") return;
                  setDescription(e.target.value);
                }}
              />
            </label>

            <div className="flex items-center text-amethyst-smoke-400 gap-2 text-xs">
              <p className="text-[0.9em] text-amethyst-smoke-800 dark:text-amethyst-smoke-600">List privacy</p>

              <label className="flex cursor-pointer items-center gap-2 rounded-full bg-transparent text-amethyst-smoke-900 dark:text-amethyst-smoke-500">
                <span className="text-xs">{isPublic ? "Public" : "Private"}</span>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => {
                    if (status === "loading") return;
                    setIsPublic(e.target.checked);
                  }}
                  className="toggle toggle-primary toggle-xs bg-transparent not-checked:text-amethyst-smoke-600"
                />
              </label>
            </div>
            {status === "idle" ? (
              <div className="w-full flex justify-center">
                <button
                  onClick={() => updateList()}
                  disabled={!isChanged}
                  className={`w-fit px-8 btn btn-sm btn-outline ${isChanged ? "border-indigo-600/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/15 dark:hover:bg-indigo-600/30" : "border-amethyst-smoke-600 text-amethyst-smoke-900/40 dark:text-amethyst-smoke-200/40"}  capitalize`}
                >
                  update
                </button>
              </div>
            ) : status === "loading" ? (
              <div className="w-full h-fit p-4">
                <LoaderComponent />
              </div>
            ) : status === "success" ? (
              <p className="text-emerald-500 dark:text-emerald-400 capitalize">list updated successfully</p>
            ) : (
              <p className="text-rose-500 dark:text-rose-400 capitalize">{error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
function ListDeleteModal({ list, setShowDeleteModal }) {
  const [status, setStatus] = useState("idle"); // idle, loading,success, error
  const [error, setError] = useState(null);

  // delete list function
  async function handleDelete() {
    try {
      setStatus("loading");
      const res = await tablesDB.deleteRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: list.$id,
      });
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
        setShowDeleteModal(false);
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
            onClick={() => setShowDeleteModal(false)}
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
                    onClick={() => setShowDeleteModal(false)}
                    className="btn btn-sm btn-outline px-6 border-amethyst-smoke-600/80 text-amethyst-smoke-900 dark:text-amethyst-smoke-200 hover:bg-amethyst-smoke-600/20 dark:hover:bg-amethyst-smoke-500/20 duration-200 text-[0.85em] capitalize w-full sm:w-auto"
                  >
                    return
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-semibold text-text-light/85 dark:text-text-dark/85 mt-1">Delete "{list?.name || "this list"}"?</h2>
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
                    onClick={() => setShowDeleteModal(false)}
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
