import { Menu, MonitorCog, Moon, Search, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import SearchModal from "./SearchModal";
import { RootContext } from "../App";

const classes = {
  navListLinkBg:
    "w-full h-10 xs:h-12 flex items-center px-4 bg-linear-180 from-amethyst-smoke-300/70 to-amethyst-smoke-400/60 dark:from-dark-amethyst-smoke-400/60 dark:to-dark-amethyst-smoke-950/60 hover:hue-rotate-45  border-b border-amethyst-smoke-400 dark:border-dark-amethyst-smoke-300 backdrop-blur-2xl",
  navListLinkText: "text-text-light dark:text-text-dark hover:cursor-pointer hover:text-dark-amethyst-smoke-700 hover:dark:text-amethyst-smoke-500 duration-300",
};

export default function NavBar({ themeSelect, theme, setTheme }) {
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
      <nav className="z-40 w-[95vw] flex justify-between items-center px-5 sm:px-7 lg:px-9 xl:px-12 h-12 capitalize fixed top-3 left-1/2 -translate-x-1/2 rounded-lg bg-amethyst-smoke-400/80 dark:bg-dark-amethyst-smoke-100 backdrop-blur-3xl">
        <Link to="/" className="inline-block h-1/4 xs:h-1/3 ">
          <img className="w-full h-full grayscale brightness-25 hover:brightness-75 dark:brightness-150 dark:hover:brightness-200 duration-300 hover:cursor-pointer" src="/logo.png" alt="logo" />
        </Link>
        <div className="flex items-center space-x-3 md:space-x-6 ">
          {windowWidth <= 640 ? (
            <div id="searchTab" onClick={() => setShowSearchModal(true)} className="group hover:cursor-pointer text-text-light dark:text-text-dark">
              <Search size={14} />
            </div>
          ) : (
            <>
              <div
                id="searchTab"
                onClick={() => setShowSearchModal(true)}
                className="group hover:cursor-pointer hover:bg-dark-amethyst-smoke-700/20 duration-300 flex items-center justify-center px-1.5 py-0.5 space-x-1 font-extralight text-xs rounded-full bg-dark-amethyst-smoke-600/5 text-text-light dark:bg-amethyst-smoke-50/10 dark:text-text-dark "
              >
                <Search size={12} />
                <span>Ctrl+K</span>
              </div>
              <div className="flex justify-evenly space-x-6">
                <Link to="/anime" className={classes.navListLinkText}>
                  anime
                </Link>
                <div className={classes.navListLinkText}>link2</div>
                <div className={classes.navListLinkText}>link3</div>
              </div>
            </>
          )}
          {/* sfw filter */}
          <div
            onClick={() => {
              setSFW((s) => !s);
            }}
            className="text-xs hover:cursor-pointer hover-blue-link duration-200"
          >
            {SFW ? "SFW" : "NSFW"}
          </div>
          <div className="group w-fit flex justify-start items-center space-x-0.5 text-sm" onClick={() => handleClick(document.getElementById("themeTogglerBtn").dataset.nextTheme)}>
            <button id="themeTogglerBtn" className="group-hover:cursor-pointer" data-next-theme={theme === "light" ? "dark" : "light"}>
              {theme === "light" ? (
                <Moon className="group-hover:stroke-blue-600 dark:group-hover:stroke-blue-300 duration-200" size={16} />
              ) : (
                <Sun className="group-hover:stroke-blue-600 dark:group-hover:stroke-blue-300 duration-200" size={16} />
              )}
            </button>
          </div>
          {windowWidth <= 640 && (
            <div className="hover:bg-amethyst-smoke-500/70 dark:hover:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer">
              <Menu size={16} onClick={() => setShowNav(!showNav)} />
            </div>
          )}
        </div>
      </nav>
      {windowWidth <= 640 && showNav && (
        <div className="w-[96vw] flex flex-col fixed top-15 left-1/2 -translate-x-1/2 text-sm xs:text-md z-30 rounded-md overflow-hidden slide-in-from-top">
          <Link to="/anime" className={`${classes.navListLinkBg} ${classes.navListLinkText}`}>
            anime
          </Link>
          <div className={`${classes.navListLinkBg} ${classes.navListLinkText}`}>link2</div>
          <div className={`${classes.navListLinkBg} ${classes.navListLinkText}`}>link3</div>
        </div>
      )}
      {showSearchModal && <SearchModal showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal} />}
    </>
  );
}
