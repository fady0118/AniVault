import { Link, useLocation, useParams } from "react-router";
import { useAuth } from "../../../Contexts/AuthContext";
import UserCustomListComp from "../UserLists/UserCustomListComp";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoaderComponent from "../../../components/LoaderComponent";
import EmptyDataFallback from "../../../components/EmptyDataFallback";
import { Query } from "appwrite";
import { tablesDB } from "../../../appwrite";

export default function OtherUserCustomListPage() {
  const { loggedInUser } = useAuth();
  const { id } = useParams();
  const { state } = useLocation();
  const [list, setList] = useState(state?.list || null);
  const [status, setStatus] = useState("idle");

  async function fetchListFromDb() {
    setStatus("loading");
    try {
      const res = await tablesDB.getRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: id,
        queries: [Query.select(["*", "listItem_id.*"])],
      });
      setList(res);
      setStatus("idle");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  }

  useEffect(() => {
    if (!list) {
      fetchListFromDb();
    }
  }, [id]);

  return (
    <div className="relative w-full flex flex-col gap-4 text-text-light dark:text-text-dark">
      {status === "loading" ? (
        <div className="w-full py-10">
          <LoaderComponent />
        </div>
      ) : list ? (
        <>
          <div className="flex flex-col gap-3 rounded-lg box-colors p-3 border border-dark-amethyst-smoke-400/20 dark:border-amethyst-smoke-500/20 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-0.5 text-sm">
              <div className="w-full flex flex-wrap items-start justify-between gap-y-1">
                <h1 className="text-[1.35em] font-semibold">{list?.name}</h1>
                <div className="text-[0.9em] text-text-light/70 dark:text-text-dark/70">
                  {list?.is_public ? (
                    <div className="flex flex-row items-center gap-1">
                      <Eye size={14} /> Public list
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-1">
                      <EyeOff size={14} /> Private list
                    </div>
                  )}
                </div>
              </div>
              {list?.description ? <p className="text-[0.9em] text-text-light/80 dark:text-text-dark/80 mt-1">{list?.description}</p> : null}
              <p className="text-[0.9em] text-text-light/75 dark:text-text-dark/75">
                {list?.listItem_id?.length} item{list?.listItem_id?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {list?.listItem_id?.length ? (
            <div className="grid grid-cols-1 gap-4">
              {list?.listItem_id?.map((item) => (
                <Link
                  key={item.$id || item.mal_id}
                  to={`/${item.mediaType || "anime"}/${item.mal_id}`}
                  className="relative w-full group flex flex-row gap-4 text-md md:text-lg overflow-hidden rounded-md border border-amethyst-smoke-500/20 bg-amethyst-smoke-500/5 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-indigo-500/10 hover:shadow-md"
                >
                  <div className="w-1/10 min-w-20 max-w-32 aspect-3/4 bg-amethyst-smoke-200/80">
                    <img src={item?.cached_img} alt={item?.title} className="h-full w-full object-cover transition duration-200 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col items-start py-3 gap-1">
                    <h2 className="text-[1em] font-semibold">{item?.title || "Untitled"}</h2>
                    <p className="text-[0.8em] text-text-light/70 dark:text-text-dark/70">{item?.notes || ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10">
              <EmptyDataFallback string="no items in this list" />
            </div>
          )}
        </>
      ) : (
        status === "error" && (
          <div className="">
            <EmptyDataFallback string="list doesn't exist or is set private by the owner" />
          </div>
        )
      )}
    </div>
  );
}
