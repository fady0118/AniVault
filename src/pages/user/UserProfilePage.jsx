import { Camera, Edit, X } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useState } from "react";
import AvatarModal from "../../components/profile/AvatarModal";
import { Link, useOutletContext } from "react-router";

export default function UserProfilePage() {
  const { loggedInUser, userData } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { setIsEditPage } = useOutletContext();

  useEffect(() => {
    setIsEditPage(false);
  }, []);
  return (
    <>
      <div id="userContent" className="relative order-2 w-full flex flex-col sm:flex-row sm:justify-start gap-3">
        <div className="w-4/5 grow flex flex-col gap-y-3">
          <div id="bio" className="w-fit max-w-full h-fit min-h-32 rounded-lg overflow-hidden box-colors">
            <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">bio</div>
            <div id="bioText" className="flex flex-col px-3 py-2 text-xs min-w-2xs">
              {userData?.bio || "this user left his bio blank"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
