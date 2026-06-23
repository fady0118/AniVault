import { useEffect, useRef, useState } from "react";
import { tablesDB } from "../../../../appwrite";

export function uselistUpdateModal( setlistToModify, setFilteredlists ) {  
  const list = useRef({});
  const [showUpdateModal, setshowUpdateModal] = useState(false);
  const [name, setName] = useState(list.current?.name);
  const [description, setDescription] = useState(list.current?.description);
  const [isPublic, setIsPublic] = useState(list.current?.is_public);
  const [isChanged, setIsChanged] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [error, setError] = useState(null);

  function updateRef(listData) {
    list.current = listData;
    setName(list.current?.name);
    setDescription(list.current?.description);
    setIsPublic(list.current?.is_public);
  }
  // close modal by pressing esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setshowUpdateModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  // update isChanged state
  useEffect(() => {
    if (name !== list.current?.name || description !== list.current?.description || isPublic !== list.current?.is_public) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
    return setStatus("idle");
  }, [name, description, isPublic]);

  // update list function
  async function updateList() {
    console.log(`updateList - ${list.current.$id}`)
    setStatus("loading");
    try {
      await tablesDB.updateRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: list.current.$id,
        data: { name, description, is_public: isPublic },
      });
      // Update local state
      const updatedlist = { ...list.current, name, description, is_public: isPublic };
      setlistToModify(updatedlist);
      setFilteredlists((prevState) => [updatedlist, ...prevState.filter((item) => item.$id !== list.current.$id)]);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      return setError("failed to update list");
    }
  }
  return { updateRef, updateList, showUpdateModal, setshowUpdateModal, status, name, setName, description, setDescription, isPublic, setIsPublic, isChanged, setIsChanged, error, setError };
}
