import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../Contexts/AuthContext";
import { tablesDB } from "../../../appwrite";
import { Query } from "appwrite";
import UserWatchList from "./UserWatchList";
import { useEffect, useState } from "react";
import UserCustomLists from "./UserCustomLists";
import { useLocation, useSearchParams } from "react-router";
import UserReviews from "./UserReviews";

export default function UserPageTabs({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = Number(searchParams.get("tab")) || 1;

  const handleTabChange = (tab) => {
    setSearchParams({ tab: Number(tab) });
  };

  // forceRefetch
  const location = useLocation();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (location.state?.forceRefetch) {
      queryClient.invalidateQueries({ queryKey: ["userLists"] });
    }
  }, []);

  function refetchReviews() {
    queryClient.invalidateQueries({queryKey: ["userReviews"]})
  }

  const [userItemQ, userListsQ, userReviewsQ] = useQueries({
    queries: [
      {
        queryKey: ["userItem", user.$id],
        queryFn: async () => {
          const res = await tablesDB.listRows({
            databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
            tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
            queries: [Query.equal("user_id", user.$id)],
          });
          return res;
        },
      },
      {
        queryKey: ["userLists", user.$id],
        queryFn: async () => {
          const res = await tablesDB.listRows({
            databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
            tableId: import.meta.env.VITE_TABLE_ID_LIST,
            queries: [Query.equal("user_id", user.$id), Query.select(["*", "listItem_id.*"])],
          });
          return res;
        },
      },
      {
        queryKey: ["userReviews", user.$id],
        queryFn: async () => {
          const res = await tablesDB.listRows({
            databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
            tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
            queries: [Query.equal("user_id_str", user.$id), Query.select(["*", "userItem.*"])],
          });
          return res;
        },
      },
    ],
  });

  return (
    <>
      <div role="tablist" id="listTabs" className="tabs tabs-box flex flex-row items-center gap-2 text-xs sm:text-sm">
        <input
          type="radio"
          name="userTabs"
          className="tab text-[0.95em] font-semibold capitalize"
          aria-label="user watchlist"
          value={1}
          checked={currentTab === 1}
          onChange={(e) => {
            handleTabChange(e.target.value);
          }}
        />
        <div className="tab-content">{userItemQ.isPending ? <div>Loading...</div> : <UserWatchList data={userItemQ?.data} refetchReviews={refetchReviews}/>}</div>

        <input
          type="radio"
          name="userTabs"
          className="tab text-[0.95em] font-semibold capitalize"
          aria-label="user custom lists"
          value={2}
          checked={currentTab === 2}
          onChange={(e) => {
            handleTabChange(e.target.value);
          }}
        />
        <div className="tab-content">{userListsQ.isPending ? <div>Loading...</div> : <UserCustomLists data={userListsQ?.data} />}</div>
        <input
          type="radio"
          name="userTabs"
          className="tab text-[0.95em] font-semibold capitalize"
          aria-label="user reviews"
          value={3}
          checked={currentTab === 3}
          onChange={(e) => {
            handleTabChange(e.target.value);
          }}
        />
        <div className="tab-content">{userReviewsQ.isPending ? <div>Loading...</div> : <UserReviews data={userReviewsQ?.data} refetchReviews={refetchReviews}/>}</div>
      </div>
    </>
  );
}
