import { useParams } from "react-router";
import UserPageTabs from "../UserLists/UserPageTabs";

export default function OtherUserProfilePage() {
  const { userId } = useParams();

  return (
    <>
      <UserPageTabs user={{ $id: userId }} />
    </>
  );
}
