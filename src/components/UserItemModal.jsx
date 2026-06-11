import { useEffect, useState } from "react";
import { tablesDB } from "../appwrite";
import { useAuth } from "../Contexts/AuthContext";
import { Query } from "appwrite";

export default function UserItemModal({ data, setShowUserItemModal }) {
  const [itemData, setItemData] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(null);
  const { loggedInUser } = useAuth();

  async function fetchItemFromDb() {
    try {
      const result = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
        queries: [Query.equal("user_id", loggedInUser.$id), Query.equal("mal_id", data.mal_id), Query.limit(1)],
      });
      setItemData(result?.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!itemData) return;
    // update status
    setStatus(itemData?.status)
    setProgress(itemData?.progress)
  }, [itemData]);

  useEffect(() => {
    fetchItemFromDb();
  }, []);

  return (
    <div className="z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg">
      <div className="fixed top-1/2 left-1/2 -translate-1/2 w-[90%] sm:w-3/4 md:w-2/3 lg:w-1/2 rounded-md p-4 box-colors-medium">
        <button onClick={() => setShowUserItemModal(false)} className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 bg-transparent" aria-label="Close authentication modal">
          ✕
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-start gap-3">
            <img src={data.images.webp.large_image_url || data.images.webp.image_url} className="w-1/4 min-w-20 max-w-32 aspect-2/3 rounded-sm object-cover" alt="" />
            <div className="flex flex-col gap-2">
              <div id="title" className="min-w-1/2 w-fit rounded-md px-1.5 py-0.5 text-sm box-colors-stronger">
                {data?.title}
              </div>
              <div className="flex gap-2">
                <select name="statusList" id="statusList" className="select select-primary bg-transparent select-xs outline-0" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="" hidden disabled>
                    Status
                  </option>
                  <option className="capitallize" value="unwatched">
                    unwatched
                  </option>
                  <option className="capitallize" value="plan_to_watch">
                    plan to watch
                  </option>
                  <option className="capitallize" value="watching">
                    watching
                  </option>
                  <option className="capitallize" value="completed">
                    completed
                  </option>
                  <option className="capitallize" value="dropped">
                    dropped
                  </option>
                </select>
                {status && status !== "unwatched" && (
                  <>
                    {status === "watching" && (
                      <>
                        <select
                          name="progressList"
                          id="progressList"
                          className="select select-primary bg-transparent select-xs outline-0"
                          value={progress}
                          onChange={(e) => setProgress(e.target.value)}
                        >
                          <option value="" selected hidden>
                            progress
                          </option>
                          {Array.from({ length: data?.episodes }, (_, i) => i).map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-rose-400">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi ex sit aliquid asperiores necessitatibus dolor nesciunt neque, dolorem harum, qui praesentium mollitia inventore. Earum
              tempore fugit odit facilis. Blanditiis, esse?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
