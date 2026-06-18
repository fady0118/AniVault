import { useQueries } from "@tanstack/react-query";
import { useAuth } from "../../../Contexts/AuthContext";
import { tablesDB } from "../../../appwrite";
import { Query } from "appwrite";
import UserWatchList from "./UserWatchList";
import { useState } from "react";
import UserCustomLists from "./UserCustomLists";

export default function UserLists({ user }) {
  const [currentTab, setCurrentTab] = useState(1);
  const [userItemQ, userListsQ] = useQueries({
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
    ],
  });

  return (
    <>
      <div role="tablist" id="listTabs" className="tabs tabs-box flex flex-row items-center gap-2">
        <input
          type="radio"
          name="userTabs"
          className="tab"
          aria-label="user watchlist"
          value={1}
          checked={Number(currentTab) === 1}
          onChange={(e) => {
            setCurrentTab(Number(e.target.value));
          }}
        />
        <div className="tab-content">{userItemQ.isPending ? <div>Loading...</div> : <UserWatchList data={userItemQ?.data} />}</div>

        <input
          type="radio"
          name="userTabs"
          className="tab"
          aria-label="user custom lists"
          value={2}
          checked={Number(currentTab) === 2}
          onChange={(e) => {
            setCurrentTab(Number(e.target.value));
          }}
        />
        <div className="tab-content">{userListsQ.isPending ? <div>Loading...</div> : <UserCustomLists data={userListsQ?.data} />}</div>
      </div>
    </>
  );
}
