import { Menu, MonitorCog, Moon, Search, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useContext, useRef } from "react";
import SearchModal from "../SearchModal";
import { RootContext } from "../../App";
import data from "../../utility/data.json";
import NavLink from "./NavLink";
import SmallNavLink from "./SmallNavLink";
const classes = {
  navListLinkText: "relative wrapper inline-block overflow-hidden font-bold text-text-light dark:text-text-dark px-2.5 py-0.5 rounded-md border navLink-colors hover:cursor-pointer duration-200",
  smallNavLink: "py-3 px-5 border-b small-navLink-colors hover:cursor-pointer duration-200",
};

export default function NavBar({ themeSelect, theme, setTheme }) {
  const navBarRef = useRef(null)
  const [showNav, setShowNav] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  let navigate = useNavigate();
  const { windowWidth, SFW, setSFW } = useContext(RootContext);
  useEffect(() => {
    themeSelect(theme);
  }, [theme]);

  function handleClick(theme) {
    setTheme(theme);
  }

  useEffect(() => {
    function handleKeyPresses(e) {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
    }
    document.addEventListener("keydown", handleKeyPresses);
    return () => document.removeEventListener("keydown", handleKeyPresses);
  }, []);

  return (
    <>
      <nav ref={navBarRef} className="z-40 w-[95vw] text-xs lg:text-sm flex justify-between items-center px-5 sm:px-7 lg:px-9 xl:px-12 h-12 capitalize fixed top-3 left-1/2 -translate-x-1/2 rounded-lg bg-amethyst-smoke-400/80 dark:bg-dark-amethyst-smoke-100 backdrop-blur-3xl">
        <Link to="/" className="inline-block h-1/4 xs:h-1/3 ">
          <img className="w-full h-full grayscale brightness-25 hover:brightness-75 dark:brightness-150 dark:hover:brightness-200 duration-300 hover:cursor-pointer" src="/logo.png" alt="logo" />
        </Link>
        <div className="flex items-center gap-x-3 lg:gap-x-5">
          {windowWidth <= 640 ? (
            <div id="searchTab" onClick={() => setShowSearchModal(true)} className="group hover:cursor-pointer text-text-light dark:text-text-dark">
              <Search size={14} className="hover:stroke-indigo-600 dark:hover:stroke-indigo-300 duration-200" />
            </div>
          ) : (
            // large screens
            <>
              <div
                id="searchTab"
                onClick={() => setShowSearchModal(true)}
                className="group hover:cursor-pointer hover:bg-dark-amethyst-smoke-700/20 duration-300 flex items-center justify-center px-1.5 py-0.5 space-x-1 font-extralight text-[0.75em] rounded-full bg-dark-amethyst-smoke-600/5 text-text-light dark:bg-amethyst-smoke-50/10 dark:text-text-dark "
              >
                <Search size={12} className="group-hover:stroke-indigo-600 dark:group-hover:stroke-indigo-300 duration-200" />
                <span>Ctrl+K</span>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <NavLink classes={classes} LinkTitle="anime" data={data.anime.genres} ref={navBarRef}/>
                <NavLink classes={classes} LinkTitle="manga" data={data.manga.genres} ref={navBarRef}/>
                <div className="group flex flex-row items-center">
                  <Link to="/manga/magazine" className={` ${classes.navListLinkText}`}>
                    Magazine
                    <div className="w-full h-0.5 absolute bottom-0 left-1/2 -translate-x-1/2 bg-pink-500/50 targetBar"></div>
                  </Link>
                </div>
              </div>
            </>
          )}
          {/* sfw filter */}
          <button
            type="button"
            onClick={() => setSFW((s) => !s)}
            className="inline-flex items-center justify-center w-10 text-[0.75em] font-semibold hover:cursor-pointer hover:text-indigo-500 transition duration-200"
          >
            {SFW ? "SFW" : "NSFW"}
          </button>

          <div className="group w-fit flex justify-start items-center space-x-0.5 text-[1.2em]" onClick={() => handleClick(document.getElementById("themeTogglerBtn").dataset.nextTheme)}>
            <button id="themeTogglerBtn" className="group-hover:cursor-pointer" data-next-theme={theme === "light" ? "dark" : "light"}>
              {theme === "light" ? (
                <Moon className="group-hover:stroke-indigo-600 dark:group-hover:stroke-indigo-300 duration-200" size={16} />
              ) : (
                <Sun className="group-hover:stroke-indigo-600 dark:group-hover:stroke-indigo-300 duration-200" size={16} />
              )}
            </button>
          </div>

          {windowWidth <= 640 && (
            <div className="hover:cursor-pointer">
              <Menu size={16} onClick={() => setShowNav(!showNav)} className="hover:stroke-indigo-600 dark:hover:stroke-indigo-300 duration-200" />
            </div>
          )}
        </div>
      </nav>
      {windowWidth <= 640 && showNav && (
        <div className="z-30 w-[95vw] flex flex-col fixed top-15 left-1/2 -translate-x-1/2 overflow-y-scroll text-sm xs:text-md font-bold capitalize box-colors-darker border border-dark-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10  rounded-md slide-in-from-top">
          <SmallNavLink classes={classes.smallNavLink} LinkTitle="anime" data={data.anime.genres} />
          <SmallNavLink classes={classes.smallNavLink} LinkTitle="manga" data={data.manga.genres} />
        </div>
      )}
      {showSearchModal && <SearchModal showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal} />}
    </>
  );
}
