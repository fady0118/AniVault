import { Search } from "lucide-react";
import { useEffect } from "react";

export default function SearchModal({ showSearchModal, setShowSearchModal }) {
  useEffect(() => {
    document.documentElement.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        setShowSearchModal(false);
      }
    });
    return () =>
      document.documentElement.removeEventListener("keydown", (e) => {
        if (e.key == "Escape") {
          setShowSearchModal(false);
        }
      });
  }, []);
  return (
    <>
      <div className="z-50 flex flex-col rounded-lg fixed top-1/2 left-1/2 transform -translate-1/2 w-5/6 h-6/7 sm:w-3/4 sm:h-4/5 max-w-2xl  text-xs backdrop-blur-2xl text-text-light dark:text-text-dark bg-amethyst-smoke-400 dark:bg-amethyst-smoke-950 shadow-xl shadow-dark-amethyst-smoke-300/80 dark:shadow-dark-amethyst-smoke-50/80">
        <div className="flex justify-between items-center p-4 border-b border-amethyst-smoke-500/20">
          <div className="w-1/2 flex items-center space-x-4">
            <Search size={12}/>
            <input type="search" placeholder="Search anime, character, etc..." className="w-3/4 outline-0"/>
          </div>
          <button
            onClick={() => setShowSearchModal(false)}
            className="flex items-center text-xs px-1 rounded-sm border border-amethyst-smoke-800/70 dark:border-amethyst-smoke-500/40  hover:bg-amethyst-smoke-800/20 hover:dark:bg-amethyst-smoke-500/20"
          >
            esc
          </button>
        </div>
      </div>
      <div className="z-40 fixed w-screen h-screen bg-dark-amethyst-smoke-50/90"></div>
    </>
  );
}
