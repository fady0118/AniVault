import { useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../../../Contexts/AuthContext";
import UserCustomListComp from "./UserCustomListComp";

export default function UserCustomListPage() {
  const { loggedInUser } = useAuth();
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div role="tablist" id="listTabs" className="tabs tabs-box flex flex-row items-center gap-2">
        <button
          className="tab"
          aria-label="user watchlist"
          onClick={() => {
            navigate("/profile?tab=1");
          }}
        >
          user watchlist
        </button>
        <button
          className="tab"
          aria-label="user custom lists"
          onClick={() => {
            navigate("/profile?tab=2", {
              state: { forceRefetch: true },
            });
          }}
        >
          user custom lists
        </button>
        <button
          className="tab"
          aria-label="user reviews"
          onClick={() => {
            navigate("/profile?tab=3");
          }}
        >
          user reviews
        </button>
      </div>
      <UserCustomListComp loggedInUser={loggedInUser} id={id} state={state} />
    </>
  );
}
