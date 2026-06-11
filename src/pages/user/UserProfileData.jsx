import { marked } from "marked";
import { useEffect } from "react";

export default function UserProfileData({ userData }) {
  // parse markdown bio
  useEffect(() => {
    if (!userData) return;
    if (userData?.bio) {
      document.getElementById("bioText").innerHTML = marked.parse(userData?.bio);
    }
  }, [userData]);
  return (
    <div id="userContent" className="relative order-2 w-full flex flex-col sm:flex-row sm:justify-start gap-3">
      <div className="grow flex flex-col gap-3">
        <div className="w-full flex flex-row gap-3 text-xs">
          <div id="info" className="w-1/5 h-fit min-h-32 rounded-lg overflow-hidden box-colors">
            <div className="border-b border-amethyst-smoke-200/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize">info</div>
            <div className="flex flex-col gap-2 capitalize px-3 py-2">
              <div>age: {userData?.age || "-"}</div>
              <div>gender: {userData?.gender || "-"}</div>
              <div>joined at: {new Date(userData?.$createdAt).toLocaleDateString("eng-us", {month:"short", day:"numeric", year:"numeric"}) || "-"}</div>
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
  );
}
