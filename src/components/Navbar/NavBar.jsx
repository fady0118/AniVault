import { CircleUserRound, LogIn, LogOut, Menu, MonitorCog, Moon, Search, Sun, User2, UserCircle2, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useContext, useRef } from "react";
import SearchModal from "../searchModal/SearchModal";
import { RootContext } from "../../App";
import data from "../../utility/data.json";
import NavLink from "./NavLink";
import SmallNavLink from "./SmallNavLink";
import { useAuth } from "../../Contexts/AuthContext";
import AuthModal from "../../pages/AuthModal";

const classes = {
  navListLinkText: "relative wrapper inline-block overflow-hidden font-bold text-text-light dark:text-text-dark px-2.5 py-0.5 rounded-md border navLink-colors hover:cursor-pointer duration-200",
  smallNavLink: "py-3 px-5 border-b bg-amethyst-smoke-400 dark:bg-dark-amethyst-smoke-100 small-navLink-colors hover:cursor-pointer duration-200",
};

export default function NavBar({ themeSelect, theme, setTheme }) {
  const navBarRef = useRef(null);
  const [showNav, setShowNav] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  let navigate = useNavigate();
  const { windowWidth, SFW, setSFW } = useContext(RootContext);
  const { loggedInUser, userData, avatarImg, init, logout } = useAuth();

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

  // user-auth related effects
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <nav
        ref={navBarRef}
        className="z-40 w-[95vw] text-xs lg:text-sm flex justify-between items-center px-5 sm:px-7 lg:px-9 xl:px-12 h-12 capitalize fixed top-3 left-1/2 -translate-x-1/2 rounded-lg bg-amethyst-smoke-400/80 dark:bg-dark-amethyst-smoke-100 backdrop-blur-3xl"
      >
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
                <NavLink classes={classes} LinkTitle="anime" data={data.anime.genres} ref={navBarRef} />
                <NavLink classes={classes} LinkTitle="manga" data={data.manga.genres} ref={navBarRef} />
                <div className="group flex flex-row items-center">
                  <Link to="/manga/magazine" className={` ${classes.navListLinkText}`}>
                    Magazine
                    <div className="w-full h-0.5 absolute bottom-0 left-1/2 -translate-x-1/2 bg-pink-500/50 targetBar"></div>
                  </Link>
                </div>
                {/* register/login */}
                {loggedInUser ? (
                  <NavLink classes={classes} LinkTitle={loggedInUser?.name} data={[]} ref={navBarRef} />
                ) : (
                  <div className="group wrapperLink flex" onClick={() => setShowAuthModal(true)}>
                    <div className={`${classes.navListLinkText}`}>
                      <div className="flex flex-row items-center gap-x-0.5">
                        Login <LogIn size={14} />
                      </div>
                      <div className="w-full h-0.5 absolute bottom-0 left-1/2 -translate-x-1/2 bg-pink-500/50 targetBar"></div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* sfw filter */}
          <label className="swap text-xs font-semibold">
            <input type="checkbox" className="hidden" checked={!SFW} readOnly />
            <div onClick={() => setSFW((s) => !s)} className="swap-off">
              SFW
            </div>
            <div onClick={() => setSFW((s) => !s)} className="swap-on">
              NSFW
            </div>
          </label>

          <div id="themeTogglerBtn" className="flex h-fit" data-next-theme={theme === "light" ? "dark" : "light"}>
            <label className="swap swap-rotate w-4">
              <input type="checkbox" className="hidden" checked={theme === "dark"} readOnly />
              <Moon className="swap-off p-0 w-full h-auto" onClick={() => handleClick(document.getElementById("themeTogglerBtn").dataset.nextTheme)} />
              <Sun className="swap-on p-0  w-full h-auto" onClick={() => handleClick(document.getElementById("themeTogglerBtn").dataset.nextTheme)} />
            </label>
          </div>

          {windowWidth <= 640 && (
            <>
              {/* smallscreens user Navlink */}
              {loggedInUser ? (
                <div className="w-4 aspect-square cursor-pointer" onClick={() => setShowProfileMenu((s) => !s)}>
                  <img
                    className="w-full h-full object-cover rounded-full border border-text-light/50 dark:border-text-dark/50 hover:border-indigo-500 duration-200"
                    src={avatarImg || "/favicon-sq.png"}
                    alt={userData?.username}
                  />
                </div>
              ) : (
                <label className="swap swap-rotate w-4 aspect-square">
                  <input type="checkbox" hidden />
                  <CircleUserRound onClick={() => setShowProfileMenu((s) => !s)} className="swap-on p-0 w-full h-auto" />
                  <CircleUserRound strokeWidth={1} onClick={() => setShowProfileMenu((s) => !s)} className="swap-off p-0 w-full h-auto" />
                </label>
              )}
              <label className="swap swap-rotate">
                <input type="checkbox" className="hidden" />
                <Menu className="swap-off p-0" size={16} onClick={() => setShowNav(!showNav)} className="hover:stroke-indigo-600 dark:hover:stroke-indigo-300 duration-200" />
                <X className="swap-on p-0" size={16} onClick={() => setShowNav(!showNav)} className="hover:stroke-indigo-600 dark:hover:stroke-indigo-300 duration-200" />
              </label>
            </>
          )}
        </div>
      </nav>
      {windowWidth <= 640 && showProfileMenu && (
        <>
          <div className="z-50 text-xs p-2 rounded-md absolute top-15 right-[2.5vw] flex flex-col gap-y-1 box-colors backdrop-blur-md">
            {loggedInUser ? (
              <>
                <div className="font-light text-[0.85em]">hello, {userData?.username}</div>
                <Link className="opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile">
                  Your Account
                </Link>
                <Link className="opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile?tab=1">
                  Your Watchlists
                </Link>
                <Link className="opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile?tab=2">
                  Your custom lists
                </Link>
                <Link className="opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile/profile_edit">
                  edit profile
                </Link>
                <div onClick={logout} className="btn btn-primary btn-xs w-fit h-fit text-[1em]">
                  logout <LogOut size={12} />
                </div>
              </>
            ) : (
              <div onClick={() => setShowAuthModal(true)} className="flex flex-row items-center btn btn-primary btn-xs text-[1em] hover:cursor-pointer duration-200">
                Login <LogIn size={12} />
              </div>
            )}
          </div>
        </>
      )}
      {windowWidth <= 640 && showNav && (
        <div className="z-30 w-[95vw] flex flex-col fixed top-15 left-1/2 -translate-x-1/2 overflow-y-scroll text-sm xs:text-md font-bold capitalize box-colors-darker border border-dark-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10  rounded-md slide-in-from-top">
          <SmallNavLink classes={classes.smallNavLink} LinkTitle="anime" data={data.anime.genres} />
          <SmallNavLink classes={classes.smallNavLink} LinkTitle="manga" data={data.manga.genres} />
        </div>
      )}
      {showSearchModal && <SearchModal setShowSearchModal={setShowSearchModal} />}
      {showAuthModal && <AuthModal setShowAuthModal={setShowAuthModal} />}
    </>
  );
}
