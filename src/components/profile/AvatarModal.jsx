import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { ID } from "appwrite";
import { storage, tablesDB } from "../../appwrite";
import LoaderComponent from "../LoaderComponent";

export default function AvatarModal({ avatarImg, setShowAvatarModal }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error
  const [error, setError] = useState(null);
  const { loggedInUser, setAvatarImg } = useAuth();

  // modal close eventListener
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowAvatarModal(false);
      }
    }
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  // update file state
  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  function evalUpload(file) {
    let error = null;
    if (!file.type.startsWith("image/")) {
      error = "Not an image";
      return setError(error);
    }
    if (file.size / 1024 > 500) error = "Max size is 500kb";
    return setError(error);
  }

  // temp local preview
  useEffect(() => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    evalUpload(file);
  }, [file]);

  // upload to backend
  async function fileUploader() {
    if (!file) return;
    setStatus("uploading");

    const fileId = ID.unique();
    try {
      const uploaded = await storage.createFile({
        bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
        fileId: fileId,
        file: file,
      });

      const user = await tablesDB.updateRow(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_TABLE_ID_USER_PROFILE, loggedInUser.$id, { avatarId: fileId });
      // instead of fetching the image from the storage we just set its state locally (more efficient)
      setAvatarImg(URL.createObjectURL(file))
    } catch (e) {
      setError(e.message);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 box-colors-lighter text-[0.75em] backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl box-colors-medium border border-base-200/60">
        <div className="w-full py-1 px-3 flex flex-row items-center justify-between border-b border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20">
          <p className="font-extrabold capitalize text-[1.25em]">Edit Avatar</p>
          <button onClick={() => setShowAvatarModal(false)} className="btn btn-ghost btn-sm btn-circle bg-transparent stroke-text-light" aria-label="Close avatar modal">
            ✕
          </button>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-3 p-3">
          <img className="w-24 sm:w-2/9 aspect-square h-fit object-cover rounded-lg overflow-hidden" src={preview || avatarImg || "/favicon-sq.png"} alt={`${loggedInUser?.name} avatar`} />
          <div className="w-full sm:w-7/9  flex flex-col gap-y-1.5">
            <p>Maximum file size is 500 kb.</p>
            <input
              type="file"
              name="avatar-upload"
              id="avatar-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="w- overflow-clip p-1 rounded-sm border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20"
            />
            {file && (
              <>
                {error && (
                  <div role="alert" className="text-rose-600 dark:text-rose-400 bg-rose-600/5 rounded-sm px-1 py-0.5 text-[1em]">
                    <span>{error}</span>
                  </div>
                )}

                {status !== "uploading" && !error && (
                  <button onClick={fileUploader} className="btn btn-primary w-fit">
                    upload
                  </button>
                )}
                {status === "uploading" && (
                  <div className="scale-75 py-2">
                    <LoaderComponent />
                  </div>
                )}
              </>
            )}

            <p className="text-[0.85em] font-light text-text-light/70 dark:text-text-dark/70">AniVault automatically displays a default avatar, or you can add a custom avatar instead.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
