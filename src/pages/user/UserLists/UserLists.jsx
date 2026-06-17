import { useQueries } from "@tanstack/react-query";
import { useAuth } from "../../../Contexts/AuthContext";
import { tablesDB } from "../../../appwrite";
import { Query } from "appwrite";
import UserWatchList from "./UserWatchList";

export default function UserLists({ user }) {
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

  return <div>{userItemQ.isPending ? <div>Loading...</div> : <UserWatchList data={userItemQ?.data} />}</div>;
}
