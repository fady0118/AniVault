import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { tablesDB } from "../../appwrite";
import { useAuth } from "../../Contexts/AuthContext";
import { CheckCircle, Circle } from "lucide-react";
import { RootContext } from "../../App";
import { jikanFetchWithCache } from "../../utility/jikanApi";
import UserItemStatusComponent from "./UserItemStatusComponent";
import UserItemListsComponent from "./UserItemListsComponent";
import UserItemReviewModal from "./UserItemReviewModal";
import { Query } from "appwrite";

const animeTypes = [
  "tv",
  "movie",
  "ova",
  "special",
  "ona",
  "music",
  "cm",
  "pv",
  "tv special",
];
// data is passed from the caller component
export default function UserItemModal({
  data = undefined,
  setShowUserItemModal,
  userItemTableData = undefined,
  setUserItems = undefined,
}) {
  const { windowWidth } = useContext(RootContext);
  // auth state to get the user_id
  const { loggedInUser } = useAuth();
  // item data from user_item table in the DB
  const [userItemData, setUserItemData] = useState(null);
  // item data from jikan
  const [jikanData, setJikanData] = useState(data ?? null);
  // derived mediatype needed in both tabs & in adding rows to appwrite tables (if userItemTableData & data are null set mediaType as null and derive it in UserItemStatusComponent)
  const [mediaType, setMediaType] = useState(
    userItemTableData?.mediaType ??
      (data
        ? animeTypes.includes(data?.type?.toLowerCase())
          ? "anime"
          : "manga"
        : null),
  );

  // item form-states
  const [currentTab, setCurrentTab] = useState("status");

  // fetch jikanData if it data==null
  useEffect(() => {
    if (data) {
      setJikanData(data);
      return;
    }
    let active = true;
    (async () => {
      try {
        const detailData = await jikanFetchWithCache(
          `https://api.jikan.moe/v4/${userItemTableData?.mediaType}/${userItemTableData?.mal_id}`,
        );
        console.log(detailData);
        if (!active) return;
        setJikanData(detailData ?? null);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      active = false;
    };
  }, [data]);
  // fetch the item data from user_item table in the DB
  async function fetchUserItemFromDb() {
    console.log("fetchItemFromDb")
    if (userItemTableData) return setUserItemData(userItemTableData);
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
        queries: [
          Query.equal("user_id", loggedInUser.$id),
          Query.equal("mal_id", jikanData?.mal_id),
          Query.limit(1),
        ],
      });
      if (!mediaType) {
        setMediaType(res?.rows[0]?.mediaType);
      }
      setUserItemData(res?.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // call fetchUserItemFromDb on component mount to populate userItemData state
    fetchUserItemFromDb();
    // addEventListener to close modal on pressing "escape"
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowUserItemModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () =>
      document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg">
      <div className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] sm:w-4/5 md:w-3/5 rounded-xl p-3 xs:p-4 max-h-[90vh] overflow-y-auto box-colors">
        <button
          onClick={() => setShowUserItemModal(false)}
          className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent"
          aria-label="Close authentication modal"
        >
          ✕
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center gap-2">
            <div
              role="tablist"
              className="tabs tabs-border w-full justify-start"
            >
              <button
                onClick={() => setCurrentTab("status")}
                role="tab"
                className={`tab ${currentTab === "status" ? "tab-active text-indigo-500" : "text-text-light/50 dark:text-text-dark/50"}`}
              >
                Status
              </button>
              <button
                onClick={() => setCurrentTab("lists")}
                role="tab"
                className={`tab ${currentTab === "lists" ? "tab-active text-indigo-500" : "text-text-light/50 dark:text-text-dark/50"}`}
              >
                Lists
              </button>
              <button
                onClick={() => setCurrentTab("review")}
                role="tab"
                className={`tab ${currentTab === "review" ? "tab-active text-indigo-500" : "text-text-light/50 dark:text-text-dark/50"}`}
              >
                Review
              </button>
            </div>
          </div>

          {currentTab === "status" && (
            <UserItemStatusComponent
              jikanData={jikanData}
              mediaType={mediaType}
              setMediaType={setMediaType}
              setUserItems={setUserItems}
              userItemData={userItemData}
              setUserItemData={setUserItemData}
            />
          )}

          {currentTab === "lists" && (
            <UserItemListsComponent
              jikanData={jikanData}
              mediaType={mediaType}
              userItemTableData={userItemTableData}
            />
          )}
          {currentTab === "review" && (
            <UserItemReviewModal
              jikanData={jikanData}
              mediaType={mediaType}
              userItemData={userItemData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
