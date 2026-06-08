import { Camera, X } from "lucide-react";
import { useAuth } from "../Contexts/AuthContext";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const { loggedInUser } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowAvatarModal(false);
      }
    }
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <>
      <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
        {loggedInUser ? (
          <>
            <div id="title" className="order-1 mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex items-center space-x-2">
              <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{loggedInUser?.name}'s Profile</div>
            </div>

            <div id="userContent" className="relative order-2 w-full flex flex-col sm:flex-row sm:justify-start gap-3">
              <div className="sm:sticky sm:top-18 flex flex-col gap-y-3 h-fit w-1/5 min-w-48 max-w-64">
                <div
                  onClick={() => {
                    setShowAvatarModal(true);
                  }}
                  id="image"
                  className="order-1 group relative hover:cursor-pointer rounded-lg box-colors duration-200"
                >
                  <div className="z-10 w-full hidden absolute top-1/2 left-1/2 -translate-1/2 group-hover:flex flex-col justify-center items-center capitalize duration-200">
                    <Camera size={22} />
                    <p>edit avatar</p>
                  </div>
                  <img
                    className="z-0 w-full aspect-square object-cover rounded-lg overflow-hidden brightness-90 group-hover:brightness-25 duration-200"
                    src={loggedInUser?.avatar_url || "/favicon-sq.png"}
                    alt={`${loggedInUser?.name} avatar`}
                  />
                </div>
              </div>
              <div className="w-4/5 grow flex flex-col gap-y-3">
                <div id="about" className="w-fit max-w-full h-fit min-h-32 rounded-lg overflow-hidden box-colors">
                  <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">About</div>
                  <div id="aboutText" className="flex flex-col px-3 py-2 text-xs min-w-2xs">
                    {loggedInUser?.bio || "this user left his bio blank"}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>you are not logged in</div>
        )}
      </div>
      {showAvatarModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 box-colors-lighter text-[0.75em] text-text-dark backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-xl box-colors-medium border border-base-200/60">
              <div className="w-full py-1 px-3 flex flex-row items-center justify-between border-b border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20">
                <p className="font-extrabold capitalize text-[1.25em]">Edit Avatar</p>
                <button onClick={() => setShowAvatarModal(false)} className="btn btn-ghost btn-sm btn-circle bg-transparent" aria-label="Close avatar modal">
                  ✕
                </button>
              </div>
              <div className="w-full flex flex-col sm:flex-row gap-4 p-3">
                <img className="w-24 aspect-square h-fit object-cover rounded-lg overflow-hidden" src={loggedInUser?.avatar_url || "/favicon-sq.png"} alt={`${loggedInUser?.name} avatar`} />
                <div className=" w-auto flex flex-col gap-y-1.5">
                  <p>All images must be a minimum size of 140 x 140 pixels. Maximum file size is 150 kb.</p>
                  <p>GIF images must be a square with the same width and height.</p>
                  <input type="file" className="p-1 rounded-sm border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20" name="avatar-upload" id="avatar-upload" />
                  <p className="text-[0.85em] font-light text-text-light-70 dark:text-text-dark-70">AniVault automatically displays a default avatar, or you can add a custom avatar instead.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
