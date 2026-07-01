import { useEffect, useState } from "react";
import { tablesDB } from "../../appwrite";
import { Query } from "appwrite";
import { useAuth } from "../../Contexts/AuthContext";
import TextAreaToolBox from "../textareaToolbox/TextAreaToolBox";
import useTextAreaToolBox from "../textareaToolbox/useTextAreaToolBox";
import useFormStatusHandling from "./useFormStatusHandling";

export default function UserItemReviewModal({ jikanData, mediaType }) {
  const { loggedInUser } = useAuth();
  // data local states
  const [reviewData, setReviewData] = useState(null);
  // status handling
  const { status, setStatus, error, setError } = useFormStatusHandling();
  // review body TextArea
  const { textAreaData, setTextAreaData, insertTextStyle } = useTextAreaToolBox(reviewData?.review_body || "");

  // appwrite data fetch
  async function fetchReviewFromDB() {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
        queries: [Query.equal("item_mal_id", data?.mal_id), Query.equal("userProfile", loggedInUser?.$id)],
      });
      setReviewData(res?.rows[0] || null);
    } catch (error) {
      // console.log(error);
      setStatus(error);
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchReviewFromDB();
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30">
      <div className="w-full grid grid-cols-1 xs:grid-cols-3 min-h-36">
        <div id="reviewBody" className="col-span-1 xs:col-span-2 bg-rose-500/10">
          <TextAreaToolBox
            metaData={{ title: "Review Text", placeholder: `Share your thoughts on this ${mediaType || "item"}...` }}
            textAreaData={textAreaData}
            setTextAreaData={setTextAreaData}
            insertTextStyle={insertTextStyle}
          />
        </div>
        <div id="reviewMeta" className="col-span-1 bg-emerald-500/10"></div>
      </div>
    </section>
  );
}
