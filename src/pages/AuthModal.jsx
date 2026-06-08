import { useContext, useEffect, useState } from "react";
import { account, tablesDB, ID } from "../appwrite";
import { useAuth } from "../Contexts/AuthContext";

export default function AuthModal({ setShowAuthModal }) {
  const { loggedInUser, login, register, logout, init } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLogin) {
      //login
      await login(email, password);
    } else {
      //signup
      const user = await register(email, password, name);
      const res = await tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_PROFILE,
        rowId: user.$id,
        data: {
          username: user.name,
        },
      });
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowAuthModal(false);
      }
    }
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 box-colors-lighter text-[0.75em] text-text-dark backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl box-colors-medium border border-base-200/60 p-8">
        <button onClick={() => setShowAuthModal(false)} className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4 bg-transparent" aria-label="Close authentication modal">
          ✕
        </button>

        {loggedInUser ? (
          <div className="space-y-6 text-center">
            <div className="uppercase tracking-[0.35em] text-primary">Welcome back</div>
            <h2 className="text-[1.75em] font-semibold">{loggedInUser.name}</h2>
            <p className=" text-base-content/70">You are currently signed in. Use the button below to logout.</p>
            <button onClick={logout} className="btn btn-primary w-full">
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-[1.75em] font-semibold">{isLogin ? "Login to your account" : "Create a new account"}</h2>
              <p className=" text-base-content/70">Securely login or register to save your favorites and personalize your experience.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* email field */}
              <div className="form-control">
                <label class="input validator bg-transparent">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  <input type="email" placeholder="mail@site.com" required value={email} onChange={(e) => setEmail(e.target.value.trim())} />
                </label>
                <div class="validator-hint hidden">Enter valid email address</div>
              </div>

              {/* password field */}
              <div className="form-control">
                <label class="input validator bg-transparent">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    type="password"
                    required
                    placeholder="Password"
                    minlength="8"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  />
                </label>
                <p class="validator-hint hidden">Must be more than 8 characters</p>
              </div>

              {/* username field */}
              {!isLogin && (
                <div className="form-control">
                  <label class="input validator bg-transparent">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </g>
                    </svg>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value.trim())}
                      type="text"
                      required
                      placeholder="Username"
                      pattern="[A-Za-z][A-Za-z0-9\-]*"
                      minlength="3"
                      maxlength="30"
                      title="Only letters, numbers or dash"
                    />
                  </label>
                  <p class="validator-hint hidden">
                    Must be 3 to 30 characters
                    <br />
                    containing only letters, numbers or dash
                  </p>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="flex items-center justify-between space-3 rounded-full border border-base-200/70 bg-base-200/50 px-4 py-3  text-base-content/70">
              <span className="font-medium">Switch mode</span>
              <label htmlFor="operationType" className="swap swap-rotate cursor-pointer">
                <input type="checkbox" name="operationType" id="operationType" hidden checked={isLogin} onChange={() => setIsLogin((prev) => !prev)} />
                <span className="swap-on btn btn-sm btn-outline">Login</span>
                <span className="swap-off btn btn-sm btn-outline">Sign Up</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
