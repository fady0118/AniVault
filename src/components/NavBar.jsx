import { Menu, MonitorCog, Moon, Search, Sun } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

const classes = {
  navListLinkBg:
    "w-full h-10 xs:h-12 flex items-center px-4 bg-linear-180 from-amethyst-smoke-300/70 to-amethyst-smoke-400/60 dark:from-dark-amethyst-smoke-400/60 dark:to-dark-amethyst-smoke-950/60 hover:hue-rotate-45  border-b border-amethyst-smoke-400 dark:border-dark-amethyst-smoke-300 backdrop-blur-2xl",
  navListLinkText: "text-text-light dark:text-text-dark hover:cursor-pointer hover:text-dark-amethyst-smoke-700 hover:dark:text-amethyst-smoke-500 duration-300",
};

export default function NavBar({ themeSelect, theme, setTheme, windowWidth }) {
  const [showNav, setShowNav] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    themeSelect(theme);
  }, [theme]);

  function handleClick(theme) {
    setTheme(theme);
  }

  return (
    <>
      <nav className="z-30 w-[95vw] flex justify-between items-center px-5 sm:px-7 lg:px-9 xl:px-12 h-12 capitalize fixed top-3 left-1/2 -translate-x-1/2 rounded-lg bg-amethyst-smoke-400 dark:bg-dark-amethyst-smoke-100 backdrop-blur-3xl">
        <a href="/" className="inline-block h-1/4 xs:h-1/3 ">
          <img
          className="w-full h-full grayscale brightness-25 hover:brightness-75 dark:brightness-150 dark:hover:brightness-200 duration-300 hover:cursor-pointer"
            src="/logo.png"
            alt="logo"
          />
        </a>
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
                <div className={classes.navListLinkText}>link1</div>
                <div className={classes.navListLinkText}>link2</div>
                <div className={classes.navListLinkText}>link3</div>
              </div>
            </>
          )}

          {windowWidth <= 640 && (
            <div className="hover:bg-amethyst-smoke-500/70 dark:hover:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer">
              <Menu size={16} onClick={() => setShowNav(!showNav)} />
            </div>
          )}
          <div
            className="group w-fit flex justify-start items-center space-x-0.5 text-sm hover:bg-amethyst-smoke-500/70 dark:hover:bg-dark-amethyst-smoke-600/40"
            onClick={() => handleClick(document.getElementById("themeTogglerBtn").dataset.theme)}
          >
            <button id="themeTogglerBtn" className="group-hover:cursor-pointer" data-theme={theme === "light" ? "dark" : "light"}>
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

      </nav>
        {windowWidth <= 640 && showNav && (
          <div className="w-[96vw] flex flex-col fixed top-15 left-1/2 -translate-x-1/2 text-sm xs:text-md z-10 rounded-md overflow-hidden">
            <div className={`${classes.navListLinkBg} ${classes.navListLinkText}`}>link1</div>
            <div className={`${classes.navListLinkBg} ${classes.navListLinkText}`}>link2</div>
            <div className={`${classes.navListLinkBg} ${classes.navListLinkText}`}>link3</div>
          </div>
        )}
        {showSearchModal && <SearchModal showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal} />}
    </>
  );
}
