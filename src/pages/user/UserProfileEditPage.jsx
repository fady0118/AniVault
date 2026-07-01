import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { account, tablesDB } from "../../appwrite";
import { redirect, useNavigate, useOutletContext } from "react-router";
import LoaderComponent from "../../components/LoaderComponent";
import { delay } from "../../utility/utils";
import useTextAreaToolBox from "../../components/textareaToolbox/useTextAreaToolBox";
import TextAreaToolBox from "../../components/textareaToolbox/TextAreaToolBox";

export default function UserProfileEditPage() {
  const { loggedInUser, userData, setUserData, avatarImg } = useAuth();
  const navigate = useNavigate();
  // tab switch
  const [currentTab, setCurrentTab] = useState(1);
  // status handling
  const [status, setStatus] = useState("idle"); // "idle", "editing", "uploading", "success", "fail"
  const [error, setError] = useState(null);
  // gender, age local states
  const [personalData, setPersonalData] = useState({ gender: userData?.gender || "", age: userData?.age || "" });
  // bio body customhook

  const { textAreaData, setTextAreaData, insertTextStyle } = useTextAreaToolBox(userData?.bio || "");
  // editPage context shows/hides edit button in title
  const { setIsEditPage } = useOutletContext();
  // show hide delete modal
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);

  // handle personal data update function
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("uploading");
    try {
      const res = await tablesDB.updateRow(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_TABLE_ID_USER_PROFILE, loggedInUser.$id, {
        gender: personalData.gender || null,
        age: Number(personalData.age) || null,
        bio: textAreaData,
      });
      console.log(res);
      setUserData(res);
      setStatus("success");
      setError(null);
    } catch (error) {
      setStatus("fail");
      setError(error);
    }
  }
// update IsEditPage value on mount
  useEffect(() => {
    setIsEditPage(true);
  }, []);

  // sync data local states with userData
  useEffect(() => {
    if (!userData) return;
    setPersonalData({ gender: userData?.gender || "", age: userData?.age || "" });
    setTextAreaData(userData?.bio || "");
  }, [userData]);

  return (
    <>
      <div role="tablist" id="listTabs" className="tabs tabs-box flex flex-row items-center gap-2">
        <input
          type="radio"
          name="profileTabs"
          className="tab"
          aria-label="Profile Settings"
          value={1}
          checked={Number(currentTab) === 1}
          onChange={(e) => {
            setCurrentTab(Number(e.target.value));
          }}
        />
        <div className="tab-content">
          <div id="editSection" className="relative w-full flex flex-col gap-3">
            <form className="flex flex-col gap-2 items-start" onSubmit={handleSubmit}>
              <div className="form-control w-full flex flex-col gap-y-1">
                <label className="font-light text-xs capitalize" htmlFor="ageInput">
                  gender
                </label>
                <select
                  className="select select-primary bg-transparent select-xs outline-0"
                  name="gender"
                  id="gender"
                  value={personalData.gender}
                  onChange={(e) => {
                    setPersonalData((s) => ({ ...s, gender: e.target.value }));
                    setStatus("editing");
                  }}
                >
                  <option value="" hidden disabled>
                    select your gender
                  </option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="rather_not_say">rather not say</option>
                </select>
              </div>
              <div className="form-control w-full flex flex-col gap-y-1">
                <label className="font-light text-xs capitalize" htmlFor="ageInput">
                  age
                </label>
                <input
                  type="number"
                  name="ageInput"
                  min="0"
                  max="120"
                  step="1"
                  placeholder="Enter Your Age"
                  className="input input-primary bg-transparent select-xs outline-0"
                  value={personalData.age}
                  onChange={(e) => {
                    setPersonalData((s) => ({ ...s, age: e.target.value }));
                    setStatus("editing");
                  }}
                />
              </div>

              <TextAreaToolBox textAreaData={textAreaData} setTextAreaData={setTextAreaData} insertTextStyle={insertTextStyle} />

              {status === "editing" && !error && (
                <button className="btn btn-primary capitalize" type="submit">
                  update info
                </button>
              )}
              {status === "uploading" && (
                <div className="scale-75 py-2">
                  <LoaderComponent />
                </div>
              )}
              {status === "success" && (
                <div className="text-emerald-600 dark:text-emerald-400 bg-emerald-600/5 rounded-sm px-1.5 py-1 text-[0.8em]">
                  <span>Your data has been updated!</span>
                </div>
              )}
              {error && (
                <div role="alert" className="text-rose-600 dark:text-rose-400 bg-rose-600/5 rounded-sm px-1.5 py-1 text-[0.8em]">
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        <input
          type="radio"
          name="profileTabs"
          className="tab"
          aria-label="Account Settings"
          value={2}
          checked={Number(currentTab) === 2}
          onChange={(e) => {
            setCurrentTab(Number(e.target.value));
          }}
        />
        <div className="tab-content">
          <div className="flex flex-col gap-3.5 text-xs md:text-sm">
            <div className="flex flex-col gap-1.5 items-start">
              <p>If you wish to update the email or password associated with your account you can do that by clicking the button below.</p>
              <button
                onClick={() => {
                  navigate("edit_email_password");
                }}
                className="btn btn-primary text-xs md:text-sm"
              >
                Edit email and password
              </button>
            </div>
            <div className="flex flex-col gap-1.5 items-start">
              <p>If you wish to delete your account you can click the button below to start the deletion process.</p>
              <button
                onClick={() => {
                  setShowAccountDeleteModal(true);
                }}
                className="btn border-0 bg-rose-600/90 text-text-dark text-xs md:text-sm"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAccountDeleteModal && <UserAccountDeleteModal loggedInUser={loggedInUser} setShowAccountDeleteModal={setShowAccountDeleteModal} />}
    </>
  );
}

function UserAccountDeleteModal({ loggedInUser, setShowAccountDeleteModal }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function verifyPassword() {
    // Exploiting updatePassword and treating it as a verifyPassword method
    try {
      await account.updatePassword(password, password);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function handleDeleteAccount(e) {
    // appwrite account-deletion requires server-side Users api
    // instead we will use Account api updateStatus to block the user account instead
    e.preventDefault();
    setStatus("loading");
    const res = await verifyPassword();
    if (res) {
      try {
        const result = await account.updateStatus();
        setStatus("success");
        await delay(2000);
        window.location.href = "/profile";
      } catch (error) {
        setError("failed to delete account");
        setStatus("error");
      }
    } else {
      setError("The password you entered is incorrect");
      setStatus("error");
    }
  }

  // close modal by pressing esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowAccountDeleteModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <>
      <div className="z-50 fixed inset-0 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg">
        <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] max-w-lg rounded-lg border border-amethyst-smoke-600/20 box-colors p-3 xs:p-5 overflow-y-auto box-colors-semi-medium">
          <button
            onClick={() => setShowAccountDeleteModal(false)}
            className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent"
            aria-label="Close authentication modal"
          >
            ✕
          </button>

          {status === "success" ? (
            <div>
              <p className="">Account deleted</p>
              <div className="w-full flex justify-center">
                <button
                  className="btn btn-soft border-0 px-8 bg-dark-amethyst-smoke-600/50 dark:bg-amethyst-smoke-800/15 hover:bg-dark-amethyst-smoke-600/65 dark:hover:bg-amethyst-smoke-800/30 duration-200"
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  return
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full gap-2 text-sm items-center">
                <p className="text-[1.6em] uppercase font-semibold tracking-widest text-rose-600 dark:text-rose-500">Delete Account</p>
                <p className="text-[0.95em] text-dark-amethyst-smoke-200 dark:text-amethyst-smoke-300">Are you sure you want to delete your account</p>
                <p className="text-[0.9em] font-light text-dark-amethyst-smoke-200/80 dark:text-amethyst-smoke-300/80">{loggedInUser?.email}</p>
              </div>

              <form className="w-full space-y-3" onSubmit={handleDeleteAccount}>
                {/* password field */}
                <div className="form-control">
                  <p className="capitalize">current password</p>
                  <label className="input bg-transparent outline-0 dark:border-amethyst-smoke-200/50 border-dark-amethyst-smoke-100/50 ">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                      </g>
                    </svg>
                    <input value={password} onChange={(e) => setPassword(e.target.value.trim())} type="password" required placeholder="Current Password" />
                  </label>
                </div>
                <div className="w-full flex flex-row gap-x-2">
                  <button type="submit" className="btn border-0 bg-rose-600 dark:bg-rose-500 text-text-dark w-fit">
                    Delete Account
                  </button>
                  {status === "loading" && (
                    <div className="scale-75">
                      <LoaderComponent />
                    </div>
                  )}
                </div>
              </form>
              {status === "error" && <p className="mt-1.5 text-rose-600 dark:text-rose-500">{error}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
