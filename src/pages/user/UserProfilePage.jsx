import { Camera, Edit, X } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useState } from "react";
import AvatarModal from "../../components/profile/AvatarModal";
import { Link, useOutletContext } from "react-router";
import { marked } from "marked";

export default function UserProfilePage() {
  const { loggedInUser, userData } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { setIsEditPage } = useOutletContext();

  useEffect(() => {
    setIsEditPage(false);
  }, []);

  useEffect(() => {
    setIsEditPage(false);
    if (userData?.bio) {
      document.getElementById("bioText").innerHTML = marked.parse(userData?.bio);
    }
  }, [userData]);
  return (
    <>
      <div id="userContent" className="relative order-2 w-full flex flex-col sm:flex-row sm:justify-start gap-3">
        <div className="grow flex flex-col gap-3">
          <div className="w-full flex flex-row gap-3 text-xs">
            <div id="info" className="w-1/5 h-fit min-h-32 rounded-lg overflow-hidden box-colors">
              <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">info</div>
              <div className="capitalize px-3 py-2">
                <div>age: {userData?.age || "-"}</div>
                <div>gender: {userData?.gender || "-"}</div>
                <div>joined at: {new Date(userData?.$createdAt).toLocaleDateString() || "-"}</div>
              </div>
            </div>
            <div id="bio" className="w-4/5 max-w-fit h-fit min-h-32 rounded-lg overflow-hidden box-colors">
              <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">bio</div>
              <div id="bioText" className="flex flex-col px-3 py-2 min-w-2xs">
                this user left his bio blank
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
