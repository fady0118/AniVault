import { Camera, Edit, X } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useState } from "react";
import AvatarModal from "../../components/profile/AvatarModal";
import { Link, useOutletContext } from "react-router";
import { marked } from "marked";
import UserProfileData from "./UserProfileData";
import UserWatchList from "./UserLists/UserWatchList";
import UserLists from "./UserLists/UserLIsts";

export default function UserProfilePage() {
  const { loggedInUser, userData } = useAuth();
  const { setIsEditPage } = useOutletContext();

  useEffect(() => {
    setIsEditPage(false);
  }, []);

  return (
    <>
      <UserProfileData userData={userData} />
      <UserLists user={loggedInUser} />
      {/* <UserWatchList user={loggedInUser}/> */}
    </>
  );
}
