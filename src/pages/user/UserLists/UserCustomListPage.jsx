import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router";
import { tablesDB } from "../../../appwrite";
import { Query } from "appwrite";

export default function UserCustomListPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const [list, setList] = useState(state?.list || null);

  return <div>{list ? <div>{list?.name}</div> : <></>}</div>;
}
