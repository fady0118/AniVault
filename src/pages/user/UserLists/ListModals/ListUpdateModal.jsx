import { useEffect } from "react";
import LoaderComponent from "../../../../components/LoaderComponent";

export default function ListUpdateModal({ setShowUpdateModal, status, name, setName, description, setDescription, isPublic, setIsPublic, updateList, isChanged, error, resetStates }) {
  // close modal by pressing esc
  useEffect(() => {
    resetStates();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowUpdateModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <>
      <div className="z-50 fixed inset-0 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg">
        <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] max-w-lg rounded-lg border border-amethyst-smoke-600/20 box-colors p-3 xs:p-5 overflow-y-auto box-colors-semi-medium">
          <button
            onClick={() => setShowUpdateModal(false)}
            className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent"
            aria-label="Close authentication modal"
          >
            ✕
          </button>
          <div className="flex flex-col w-full gap-2 text-xs">
            <h2 className="text-[2em] font-semibold text-text-light/85 dark:text-text-dark/85 mt-1">Edit "{name || "this list"}"</h2>
            <label htmlFor="listName" className="w-fit min-w-3/4 flex flex-col gap-0.5 text-[1em]">
              <p className="w-fit text-text-light/65 dark:text-text-dark/65 text-[1.2em]">List Name</p>
              <input
                type="text"
                name="listName"
                id="listName"
                className="w-full p-2 h-fit input bg-transparent border-text-light/25 dark:border-text-dark/25 outline-0 text-[1.1em]"
                value={name || ""}
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
                value={description || ""}
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
