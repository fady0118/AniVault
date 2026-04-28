import { Menu, MonitorCog, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function NavBar({ themeSelect, theme, setTheme, windowWidth }) {
  const [showThemeList, setShowThemeList] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const classes = {
    navListLink:
      "w-full h-10 xs:h-12 flex items-center px-4 bg-linear-180 from-amethyst-smoke-300/70 to-amethyst-smoke-400/60 dark:from-dark-amethyst-smoke-400/60 dark:to-dark-amethyst-smoke-950/60 dark:text-text-dark border-b border-amethyst-smoke-400 dark:border-dark-amethyst-smoke-300 backdrop-blur-2xl",
  };

  useEffect(() => {
    themeSelect(theme);
  }, [theme]);

  function handleClick(theme) {
    setTheme(theme);
    setShowThemeList(false);
  }

  return (
    <>
      <div className="w-screen flex justify-between items-center px-5 sm:px-7 lg:px-9 xl:px-12 h-15 capitalize fixed top-0 bg-amethyst-smoke-400/70 dark:bg-dark-amethyst-smoke-100/70 backdrop-blur-3xl shadow-2xl shadow-amethyst-smoke-800/40">
        <div>Logo</div>
        <div className="flex space-x-3">
          {windowWidth <= 480 ? (
            <>
              <div
                className="group w-fit flex justify-start items-center space-x-0.5 text-sm hover:bg-amethyst-smoke-500/70 dark:hover:bg-dark-amethyst-smoke-600/40"
                onClick={() => handleClick(document.getElementById("themeTogglerBtn").dataset.theme)}
              >
                <button id="themeTogglerBtn" className="group-hover:cursor-pointer" data-theme={theme === "light" ? "dark" : "light"}>
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </button>
              </div>
            </>
          ) : windowWidth <= 640 ? (
            <>
              <div
                className={`relative w-20 flex justify-start items-center space-x-1 hover:cursor-pointer text-sm hover:bg-amethyst-smoke-500/70 dark:hover:bg-dark-amethyst-smoke-600/40 ${showThemeList ? "bg-amethyst-smoke-500/70 dark:bg-dark-amethyst-smoke-600/40" : ""} `}
                id="colorThemeBtn"
                onClick={() => {
                  setShowThemeList(!showThemeList);
                }}
              >
                <div className="ml-1">{theme === "light" ? <Sun size={16} /> : theme === "dark" ? <Moon size={16} /> : <MonitorCog size={16} />}</div>
                <p>Theme</p>
                <div
                  id="themeDropList"
                  className={`absolute top-0 transform translate-y-1/3 p-1 text-text-light dark:text-text-dark bg-amethyst-smoke-400 dark:bg-dark-amethyst-smoke-950 border border-amethyst-smoke-700 dark:border-dark-amethyst-smoke-600 w-full ${showThemeList ? "flex" : "hidden"} flex-col space-y-0.5 text-sm`}
                >
                  <div
                    className="hover:bg-amethyst-smoke-500/70 hover:dark:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer flex items-center space-x-1 h-4 p-1 box-content"
                    onClick={() => handleClick("light")}
                  >
                    <Sun size={16} />
                    <p>light</p>
                  </div>
                  <div
                    className="hover:bg-amethyst-smoke-500/70 hover:dark:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer flex items-center space-x-1 h-4 p-1 box-content"
                    onClick={() => handleClick("dark")}
                  >
                    <Moon size={16} />
                    <p>dark</p>
                  </div>
                  <div
                    className="hover:bg-amethyst-smoke-500/70 hover:dark:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer flex items-center space-x-1 h-4 p-1 box-content"
                    onClick={() => handleClick("os")}
                  >
                    <MonitorCog size={16} />
                    <p>os</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex space-x-10 mr-18">
                <div className="text-text-light dark:text-text-dark">link1</div>
                <div className="text-text-light dark:text-text-dark">link2</div>
                <div className="text-text-light dark:text-text-dark">link3</div>
              </div>
              <div
                className={`relative w-24 flex justify-start items-center space-x-2 hover:cursor-pointer text-sm hover:bg-amethyst-smoke-500/70 dark:hover:bg-dark-amethyst-smoke-600/40 ${showThemeList ? "bg-amethyst-smoke-500/70 dark:bg-dark-amethyst-smoke-600/40" : ""} `}
                id="colorThemeBtn"
                onClick={() => {
                  setShowThemeList(!showThemeList);
                }}
              >
                <div className="ml-1">{theme === "light" ? <Sun size={16} /> : theme === "dark" ? <Moon size={16} /> : <MonitorCog size={16} />}</div>
                <p>Theme</p>
                <div
                  id="themeDropList"
                  className={`absolute top-0 transform translate-y-1/3 p-1 text-text-light dark:text-text-dark bg-amethyst-smoke-400 dark:bg-dark-amethyst-smoke-950 border border-amethyst-smoke-700 dark:border-dark-amethyst-smoke-600 w-full ${showThemeList ? "flex" : "hidden"} flex-col space-y-0.5 text-sm`}
                >
                  <div
                    className="hover:bg-amethyst-smoke-500/70 hover:dark:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer flex items-center space-x-1.5 h-4 p-1 box-content"
                    onClick={() => handleClick("light")}
                  >
                    <Sun size={16} />
                    <p>light</p>
                  </div>
                  <div
                    className="hover:bg-amethyst-smoke-500/70 hover:dark:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer flex items-center space-x-1.5 h-4 p-1 box-content"
                    onClick={() => handleClick("dark")}
                  >
                    <Moon size={16} />
                    <p>dark</p>
                  </div>
                  <div
                    className="hover:bg-amethyst-smoke-500/70 hover:dark:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer flex items-center space-x-1.5 h-4 p-1 box-content"
                    onClick={() => handleClick("os")}
                  >
                    <MonitorCog size={16} />
                    <p>os</p>
                  </div>
                </div>
              </div>
            </>
          )}
          {windowWidth <= 640 && (
            <div className="hover:bg-amethyst-smoke-500/70 dark:hover:bg-dark-amethyst-smoke-600/40 hover:cursor-pointer">
              <Menu size={16} onClick={() => setShowNav(!showNav)} />
            </div>
          )}
        </div>
      </div>
      {windowWidth <= 640 && showNav && (
        <div className="w-screen flex flex-col fixed top-15 text-sm xs:text-md">
          <div className={classes.navListLink}>link1</div>
          <div className={classes.navListLink}>link2</div>
          <div className={classes.navListLink}>link3</div>
        </div>
      )}
    </>
  );
}
