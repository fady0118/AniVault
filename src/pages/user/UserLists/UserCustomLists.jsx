import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { tablesDB } from "../../../appwrite";
import LoaderComponent from "../../../components/LoaderComponent";
import { delay } from "../../../utility/utils";
import { Eye, EyeOff } from "lucide-react";
import ListUpdateModal from "./ListModals/ListUpdateModal";
import ListDeleteModal from "./ListModals/ListDeleteModal";
import { useListUpdateDeleteModal } from "./ListModals/useListUpdateDeleteModal";

export default function UserCustomLists({ data }) {
  const navigate = useNavigate();
  const [filteredLists, setFilteredLists] = useState(data?.rows ?? []);
  const [listToModify, setListToModify] = useState(null);

  const {
    updateRef,
    updateList,
    handleDelete,
    showUpdateModal,
    setshowUpdateModal,
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
  } = useListUpdateDeleteModal(setListToModify, setFilteredLists);

  useEffect(() => {
    updateRef(listToModify);
  }, [listToModify]);

  const handleEditList = (list) => {
    setListToModify(list);
    setshowUpdateModal(true);
    setShowDeleteModal(false);
  };

  const handleDeleteList = (list) => {
    setListToModify(list);
    setShowDeleteModal(true);
    setshowUpdateModal(false);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-4">
        {filteredLists?.map((list) => (
          <Link
            to={`userList/${list?.$id}`}
            key={list?.$id}
            className="w-full flex flex-row flex-wrap items-start gap-4 p-4 rounded-lg bg-amethyst-smoke-400/80 dark:bg-dark-amethyst-smoke-200/80 border border-amethyst-smoke-600/30 hover:bg-indigo-500/10 hover:cursor-pointer hover:shadow-[0px_5px_10px_#4f39f64d] duration-200"
          >
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

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row justify-between">
                  <h3 className="text-lg font-semibold">{list?.name}</h3>
                  <div className="text-[0.75em] text-text-light/70 dark:text-text-dark/70">
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
                {list?.description && <p className="text-[0.8em] max-lines-1 cutoff-text-abs text-text-light/70 dark:text-text-dark/70">{list?.description}</p>}
                <p className="text-xs text-text-light/80 dark:text-text-dark/80">
                  {list?.listItem_id?.length || 0} item{list?.listItem_id?.length !== 1 ? "s" : ""}
                </p>
              </div>
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
                    handleEditList(list);
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

      {showUpdateModal && (
        <ListUpdateModal
          setshowUpdateModal={setshowUpdateModal}
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
    </>
  );
}
