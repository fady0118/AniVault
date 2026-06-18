import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
          <div
            onClick={() => navigate(`/userList/${list?.$id}`, { state: { list } })}
            key={list?.$id}
            className="w-full flex flex-row flex-wrap items-start gap-4 p-4 rounded-lg border border-amethyst-smoke-600/30 hover:bg-indigo-500/10 hover:cursor-pointer hover:shadow-[0px_5px_10px_#4f39f64d] "
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
                {list?.description && <p className="text-sm">{list?.description}</p>}
                <p className="text-xs text-text-light/60 dark:text-text-dark/60">
                  {list?.listItem_id?.length || 0} item{list?.listItem_id?.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div id="buttons" className="flex flex-row gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditList(list);
                  }}
                  className="btn btn-sm btn-outline border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20 capitalize"
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
          </div>
        ))}
      </div>
      {showEditModal && <ListEditModal list={listToModify} setShowEditModal={setShowEditModal} />}
      {showDeleteModal && <ListDeleteModal list={listToModify} setShowDeleteModal={setShowDeleteModal} />}
    </>
  );
}

function ListEditModal({ list, setShowEditModal }) {
  const [name, setName] = useState(list?.name);
  const [description, setDescription] = useState(list?.description);
  const [isPublic, setIsPublic] = useState(list?.is_public);
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEditModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);
  useEffect(() => {
    if (name !== list?.name || description !== list?.description || isPublic !== list?.is_public) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [name, description, isPublic]);
  return (
    <>
      <div className="z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg">
        <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] sm:w-4/5 md:w-3/5 rounded-lg p-3 xs:p-4 max-h-[90vh] overflow-y-auto box-colors">
          <button onClick={() => setShowEditModal(false)} className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent" aria-label="Close authentication modal">
            ✕
          </button>
          <div className="flex flex-col w-full gap-2">
            <input
              type="text"
              name="listName"
              id="listName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              name="listDescription"
              id="listDescription"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <div className="flex items-center text-amethyst-smoke-400 gap-2 text-xs">
              <p className="text-[0.9em] text-amethyst-smoke-800 dark:text-amethyst-smoke-600">List privacy</p>

              <label className="flex cursor-pointer items-center gap-2 rounded-full bg-transparent text-amethyst-smoke-900 dark:text-amethyst-smoke-500">
                <span className="text-xs">{isPublic ? "Public" : "Private"}</span>
                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="toggle toggle-primary toggle-xs bg-transparent" />
              </label>
            </div>
            {isChanged && <button className="btn btn-sm btn-outline border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20 capitalize">update</button>}
          </div>
        </div>
      </div>
    </>
  );
}
function ListDeleteModal({ list, setShowDeleteModal }) {
  function handleDelete() {
    console.log("deleting list...", list?.name || list?.$id);
  }
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowDeleteModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, [setShowDeleteModal]);
  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 text-md">
        <div className="w-full max-w-lg rounded-3xl border border-amethyst-smoke-600/30 dark:border-amethyst-smoke-500/20 bg-base-100/95 dark:bg-[#11141a]/95 shadow-2xl shadow-slate-950/40 p-6 box-colors">
          <button onClick={() => setShowDeleteModal(false)} className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4 bg-transparent" aria-label="Close delete confirmation modal">
            ✕
          </button>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-text-light/50 dark:text-text-dark/50">Confirm deletion</p>
              <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mt-1">Delete "{list?.name || "this list"}"?</h2>
              <p className="mt-2 text-sm text-text-light/70 dark:text-text-dark/70">This action cannot be undone. The list and any saved metadata will be permanently removed.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-outline border-rose-600/80 text-rose-700 dark:text-rose-300 hover:bg-rose-500/15 dark:hover:bg-rose-600/30 text-[0.85em] capitalize w-full sm:w-auto"
              >
                Confirm delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-sm btn-outline border-amethyst-smoke-600 text-amethyst-smoke-900 dark:text-amethyst-smoke-200 hover:bg-amethyst-smoke-200/80 dark:hover:bg-amethyst-smoke-500/20 text-[0.85em] capitalize w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
