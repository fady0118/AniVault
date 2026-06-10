import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { Camera, Edit } from "lucide-react";
import { Link, Outlet } from "react-router";
import AvatarModal from "../../components/profile/AvatarModal";

export default function ProfileLayout() {
  const { loggedInUser, userData, avatarImg } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <>
      <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
        {loggedInUser ? (
          <>
            <div className="flex flex-row items-start gap-3 mt-3">
              <div className="flex flex-col gap-y-3 h-fit w-1/5 min-w-48 max-w-64">
                <div
                  onClick={() => {
                    setShowAvatarModal(true);
                  }}
                  id="image"
                  className="order-1 group relative hover:cursor-pointer rounded-lg box-colors duration-200"
                >
                  <div className="z-10 w-full hidden absolute top-1/2 left-1/2 -translate-1/2 group-hover:flex flex-col justify-center items-center capitalize duration-200 text-text-dark">
                    <Camera size={22} />
                    <p>edit avatar</p>
                  </div>
                  <img
                    className="z-0 w-full aspect-square object-cover rounded-lg overflow-hidden brightness-90 group-hover:brightness-25 duration-200"
                    src={avatarImg || "/favicon-sq.png"}
                    alt={`${loggedInUser?.name} avatar`}
                  />
                </div>
              </div>
              <div id="title" className="order-1 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex items-center space-x-2">
                <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{loggedInUser?.name}'s Profile</div>
                <Link to="/profile/profile_edit">{!window.location.pathname.includes("profile_edit") && <Edit size={18} />}</Link>
              </div>
            </div>
            <Outlet />
          </>
        ) : (
          <div>you are not logged in</div>
        )}
      </div>
      {showAvatarModal && <AvatarModal avatarImg={avatarImg} setShowAvatarModal={setShowAvatarModal} />}
    </>
  );
}
