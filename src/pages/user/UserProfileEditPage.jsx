import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { tablesDB } from "../../appwrite";
import { useOutletContext } from "react-router";
import LoaderComponent from "../../components/LoaderComponent";

export default function UserProfileEditPage() {
  const { loggedInUser, userData, setUserData, avatarImg } = useAuth();
  const [status, setStatus] = useState("idle"); // "idle", "editing", "uploading", "success", "fail"
  const [error, setError] = useState(null);
  const [personalData, setPersonalData] = useState({ gender: userData?.gender || "", age: userData?.age || "", bio: userData?.bio || "" });
  const { setIsEditPage } = useOutletContext();
  const bioTextareaRef = null;

  const insertTextStyle = (before, after = "") => {
    const textarea = document.getElementById("bioInput");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = personalData.bio.substring(start, end);
    const newText = personalData.bio.substring(0, start) + before + selectedText + after + personalData.bio.substring(end);
    setPersonalData((s) => ({ ...s, bio: newText }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("uploading");
    try {
      const res = await tablesDB.updateRow(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_TABLE_ID_USER_PROFILE, loggedInUser.$id, {
        gender: personalData.gender || null,
        age: Number(personalData.age) || null,
        bio: personalData.bio || null,
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

  useEffect(() => {
    setIsEditPage(true);
  }, []);
  return (
    <>
      <h2 className="text-gl font-bold">Profile Settings</h2>
      <div id="editSection" className="relative w-full flex flex-col gap-3">
        <form className="flex flex-col gap-2 items-start" onSubmit={handleSubmit}>
          <div className="form-control w-full flex flex-col gap-y-1">
            <label className="font-light text-xs capitalize" htmlFor="ageInput">
              gender
            </label>
            <select
              class="select select-primary bg-transparent select-xs outline-0"
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
              <option value="prefer_not_say">prefer not say</option>
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
              class="input input-primary bg-transparent select-xs outline-0"
              value={personalData.age}
              onChange={(e) => {
                setPersonalData((s) => ({ ...s, age: e.target.value }));
                setStatus("editing");
              }}
            />
          </div>
          <div className="form-control w-full flex flex-col gap-y-1">
            <label className="font-light text-xs capitalize" htmlFor="bioInput">
              bio
            </label>
            <div className="flex gap-1 mb-1">
              <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("**", "**")} title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("*", "*")} title="Italic">
                <em>I</em>
              </button>
              <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("__", "__")} title="Underline">
                <u>U</u>
              </button>
              <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("~~", "~~")} title="Strikethrough">
                <s>S</s>
              </button>
              <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("`", "`")} title="Code">
                &lt;/&gt;
              </button>
            </div>
            <textarea
              name="bioInput"
              id="bioInput"
              placeholder="Tell us about yourself..."
              className="textarea textarea-primary bg-transparent select-xs outline-0"
              rows="4"
              value={personalData.bio}
              onChange={(e) => {
                setPersonalData((s) => ({ ...s, bio: e.target.value }));
                setStatus("editing");
              }}
            />
          </div>
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
            <div class="text-emerald-600 dark:text-emerald-400 bg-emerald-600/5 rounded-sm px-1.5 py-1 text-[0.8em]">
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
    </>
  );
}
