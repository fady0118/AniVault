import { useParams } from "react-router";
import UserLists from "../UserLists/UserLIsts";

export default function OtherUserProfilePage() {
  const { userId } = useParams();

  return (
    <>
      <UserLists user={{ $id: userId }} />
    </>
  );
}
