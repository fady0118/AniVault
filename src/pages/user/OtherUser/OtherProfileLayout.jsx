import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { storage, tablesDB } from "../../../appwrite";
import UserProfileData from "../UserProfileData";

export default function OtherProfileLayout() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);

  async function fetchUserData(id) {
    try {
      const res = await tablesDB.getRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_PROFILE,
        rowId: id,
      });
      setUserData(res);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAvatarImg() {
    try {
      const res = await storage.getFileView({ bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID, fileId: userData.avatarId });
      setAvatarImg(res);
    } catch (error) {
      console.log(error);
    }
  }

  // fetch userData
  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  // fetch user avatar
  useEffect(() => {
    if (!userData) return;
    if (userData?.avatarId) {
      fetchAvatarImg();
    }
  }, [userData]);
  return (
    <>
      <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark">
        <>
          <div className="flex flex-row items-start flex-wrap gap-3 mt-3">
            <div className="flex flex-col gap-y-3 h-fit w-1/7 min-w-24 max-w-48">
              <div id="image" className="order-1 group relative hover:cursor-pointer rounded-lg box-colors duration-200">
                <img
                  className="z-0 w-full aspect-square object-cover rounded-lg overflow-hidden brightness-90 group-hover:brightness-25 duration-200"
                  src={avatarImg || "/favicon-sq.png"}
                  alt={`${userData?.username} avatar`}
                />
              </div>
            </div>
            <div id="title" className="order-1 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex items-center space-x-2">
              <div className="text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark">{userData?.username}'s Profile</div>
            </div>
          </div>
        </>
        <UserProfileData userData={userData} />
        <Outlet />
      </div>
    </>
  );
}
