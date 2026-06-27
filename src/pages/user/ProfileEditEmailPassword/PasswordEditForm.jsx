import { useEffect, useState } from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import { account } from "../../../appwrite";

export default function PasswordEditForm() {
  const { loggedInUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setStatus("error");
      setError("all fields are required");
      return;
    }
    if (currentPassword === newPassword) {
      setStatus("error");
      setError("new and current passwords must be different");
      return;
    }
    try {
      const result = await account.updatePassword({
        password: newPassword,
        oldPassword: currentPassword,
      });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      if (error.code === 401) {
        setError("current password is incorrect");
      } else {
        setError(error.message);
      }
    }
  }
  useEffect(() => {
    // reset status
    setStatus("idle");
    setError(null);
  }, [currentPassword, newPassword]);

  return (
    <div className="flex flex-col items-start gap-y-3">
      <h2 className="font-bold text-[1.35em]">Change Password</h2>
      <div className="w-full space-y-3">
        {/* email field */}
        <div className="form-control">
          <p className="">{loggedInUser?.email.replaceAll(/\d/g, "*")}</p>
        </div>
        {/* current password field */}
        <div className="form-control">
          <p className="capitalize">current password</p>
          <label className="input validator border-base-300/15 dark:border-white/15 bg-amethyst-smoke-300 dark:bg-transparent outline-0">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value.trim())} required minLength="8" placeholder="Current Password" />
            <p className="validator-hint hidden">Must be more than 8 characters</p>
          </label>
        </div>

        {/* new password field */}
        <div className="form-control">
          <p className="capitalize">new password</p>
          <label className="input validator border-base-300/15 dark:border-white/15 bg-amethyst-smoke-300 dark:bg-transparent outline-0">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value.trim())} required minLength="8" placeholder="New Password" />
          </label>
          <p className="validator-hint hidden">Must be more than 8 characters</p>
        </div>

        <button type="submit" className="btn btn-primary w-fit" onClick={handleChangePassword}>
          Save Changes
        </button>
        {status === "error" && <p className="alert alert-error alert-soft border-rose-500/5 bg-rose-500/10 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400">{error}</p>}
        {status === "success" && (
          <p className="alert alert-success alert-soft border-emerald-500/5 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">password updated successfully</p>
        )}
      </div>
    </div>
  );
}
