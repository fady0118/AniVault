import { useEffect, useRef } from "react";
import { Link } from "react-router";
import NavLinkBox from "./NavLinkBox";
import { useAuth } from "../../Contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function NavLink({ classes, LinkTitle, data, ref }) {
  const { userData, avatarImg, logout } = useAuth();
  const navLinkBoxRef = useRef(null);
  function calcPos(e) {
    const navBarRect = ref.current.getBoundingClientRect();
    const navLinkRect = e.target.getBoundingClientRect();
    const navLinkBoxRect = navLinkBoxRef.current.getBoundingClientRect();
    if (navLinkRect.left + navLinkBoxRect.width > navBarRect.right) {
      navLinkBoxRef.current.style.right = `0px`;
      navLinkBoxRef.current.style.left = "";
    } else {
      navLinkBoxRef.current.style.left = `${navLinkRect.left - navBarRect.left}px`;
      navLinkBoxRef.current.style.right = "";
    }
    navLinkBoxRef.current.style.top = `${navLinkRect.bottom - navBarRect.top}px`;
  }

  return (
    <div className=" group wrapperLink flex flex-row items-center">
      {data.length ? (
        <>
          {/* anime/manga Navlinks */}
          <Link onMouseEnter={(e) => calcPos(e)} to={`/${LinkTitle}`} className={classes.navListLinkText}>
            {LinkTitle}
            <div className="w-full h-0.5 absolute bottom-0 left-1/2 -translate-x-1/2 bg-pink-500/50 targetBar"></div>
          </Link>
          {/* anime/manga genres box */}
          <NavLinkBox ref={navLinkBoxRef} LinkTitle={LinkTitle} data={data} />
        </>
      ) : (
        <>
          {/* user Navlink */}
          <div onMouseEnter={(e) => calcPos(e)} className="w-6 aspect-square relative wrapper inline-block overflow-hidden duration-200">
            <Link to="/profile">
              <img
                className="w-full h-full object-cover rounded-full border-2 border-text-light/50 dark:border-text-dark/50 hover:border-indigo-500 duration-200"
                src={avatarImg || "/favicon-sq.png"}
                alt={userData?.username}
              />
            </Link>
          </div>
          {/* logout largeScreens form */}
          <div ref={navLinkBoxRef} className="w-fit absolute box-colors-darker border border-dark-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10 rounded-md linkTarget">
            <div className="w-full h-full p-2 flex flex-col items-start gap-y-1">
              <div className="w-full flex flex-col gap-y-1">
                <div className="font-light text-[0.85em]">hello, {userData?.username}</div>
                <div className="w-fit grid grid-cols-1 gap-1.5">
                  <Link className="text-nowrap opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile">
                    Your Account
                  </Link>
                  <Link className="text-nowrap opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile?tab=1">
                    Your Watchlists
                  </Link>
                  <Link className="text-nowrap opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile?tab=2">
                    Your custom lists
                  </Link>
                  <Link className="text-nowrap opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile?tab=3">
                    Your reviews
                  </Link>
                  <Link className="text-nowrap opacity-65 hover:cursor-pointer hover:opacity-100 duration-200" to="/profile/profile_edit">
                    edit profile
                  </Link>
                </div>
                <div onClick={logout} className="btn btn-primary w-fit h-fit">
                  logout <LogOut size={14} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
