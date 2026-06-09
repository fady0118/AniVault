import { Camera, X } from "lucide-react";
import { useAuth } from "../Contexts/AuthContext";
import { useEffect, useState } from "react";
import AvatarModal from "../components/profile/AvatarModal";
import { storage } from "../appwrite";

export default function UserProfilePage() {
  const { loggedInUser, userData } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarImg, setAvatarImg] = useState(null);


  async function fetchAvatarFromBucket(id) {
    if (!id) return;
    const result = await storage.getFileView({
      bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
      fileId: id,
    });
    if (!result) return;
    console.log(result)
    setAvatarImg((result));
  }
  useEffect(() => {
    if (!loggedInUser) return;
    if (!userData) return;
    fetchAvatarFromBucket(userData.avatarId);
  }, [loggedInUser, userData]);
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
      {showAvatarModal && <AvatarModal avatarImg={avatarImg} setShowAvatarModal={setShowAvatarModal} />}
    </>
  );
}
