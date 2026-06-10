import { useAuth } from "../../Contexts/AuthContext";

export default function UserProfileEditPage() {
  const { loggedInUser, userData, avatarImg } = useAuth();
  return (
    <>
      <div id="editSection" className="relative order-2 w-full flex flex-col sm:flex-row sm:justify-start gap-3">
        <h2 className="text-gl font-bold">Profile Settings</h2>
      </div>
    </>
  );
}
