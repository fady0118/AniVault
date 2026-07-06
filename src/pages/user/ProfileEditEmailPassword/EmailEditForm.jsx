import { useEffect, useState } from "react";
import { account } from "../../../appwrite";
import LoaderComponent from "../../../components/LoaderComponent";

export default function EmailEditForm() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // Update currently logged in user account email address
  async function handleChangeEmail(e) {
    e.preventDefault();
    setStatus("loading");
    if (!password || !email || !confirmEmail) {
      setStatus("error");
      setError("all fields are required");
      return;
    }
    if (email !== confirmEmail) {
      setStatus("error");
      setError("Email & ConfirmEmail fields must match");
      return;
    }
    try {
      const result = await account.updateEmail({
        email: email,
        password: password,
      });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      if (error.code === 409) {
        setError("You cannot reuse your old email address as the new one");
      } else {
        setError(error.message);
      }
    }
  }

  useEffect(() => {
    // reset status
    setStatus("idle");
    setError(null);
  }, [email, confirmEmail, password]);

  return (
    <div className="flex flex-col items-start gap-y-3">
      <h2 className="font-bold text-[1.35em]">Change Email</h2>
      <form className="w-full space-y-3" onSubmit={handleChangeEmail}>
        {/* password field */}
        <div className="form-control">
          <p className="capitalize">current password</p>
          <label className="input border-base-300/15 dark:border-white/15 bg-amethyst-smoke-300 dark:bg-transparent outline-0">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input value={password} onChange={(e) => setPassword(e.target.value.trim())} type="password" required placeholder="Current Password" />
          </label>
        </div>

        {/* email field */}
        <div className="form-control">
          <p className="capitalize">new email</p>
          <label className="input validator border-base-300/15 dark:border-white/15 bg-amethyst-smoke-300 dark:bg-transparent outline-0">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input type="email" placeholder="mail@site.com" required value={email} onChange={(e) => setEmail(e.target.value.trim())} />
          </label>
          <div className="validator-hint hidden">Enter valid email address</div>
        </div>
        {/* confirm email field */}
        <div className="form-control">
          <p className="capitalize">confirm new email</p>
          <label className="input validator border-base-300/15 dark:border-white/15 bg-amethyst-smoke-300 dark:bg-transparent outline-0">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input type="email" placeholder="mail@site.com" required value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value.trim())} />
          </label>
          <div className="validator-hint hidden">Enter valid email address</div>
        </div>

        <div className="w-full flex flex-row gap-x-2">
          <button type="submit" className="btn btn-primary w-fit">
            Save Changes
          </button>
          {status === "loading" && (
            <div className="scale-75">
              <LoaderComponent />
            </div>
          )}
        </div>
        {status === "error" && <p className="alert alert-error alert-soft border-rose-500/5 bg-rose-500/10 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400">{error}</p>}
        {status === "success" && (
          <p className="alert alert-success alert-soft border-emerald-500/5 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">email updated successfully</p>
        )}
      </form>
    </div>
  );
}
