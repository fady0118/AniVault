import { useEffect, useRef, useState } from "react";
import { tablesDB } from "../../../../appwrite";

export function useListUpdateDeleteModal(setlistToModify, setFilteredLists) {
  const list = useRef({});
  const [showUpdateModal, setshowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  // update isChanged state
  useEffect(() => {
    if (name !== list.current?.name || description !== list.current?.description || isPublic !== list.current?.is_public) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
    return setStatus("idle");
  }, [name, description, isPublic]);

  function resetStates() {
    setName(list.current?.name);
    setDescription(list.current?.description);
    setIsPublic(list.current?.is_public);
    setIsChanged(false);
    setStatus("idle");
    setError(null);
  }

  // update list function
  async function updateList() {
    console.log(`updateList - ${list.current.$id}`);
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
      setFilteredLists((prevState) => [updatedlist, ...prevState.filter((item) => item.$id !== list.current.$id)]);
      setStatus("success");
    } catch (error) {
      console.log(error);
      setStatus("error");
      return setError("failed to update list");
    }
  }

  // delete list function
  async function handleDelete() {
    try {
      setStatus("loading");
      const res = await tablesDB.deleteRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_LIST,
        rowId: list.current.$id,
      });
      console.log(res);
      setFilteredLists((prevState) => [...prevState.filter((l) => l?.$id !== list.current.$id)]);
      setStatus("success");
    } catch (error) {
      console.log(error);
      setStatus("error");
      return setError("failed to delete list");
    }
  }

  return {
    updateRef,
    updateList,
    handleDelete,
    showUpdateModal,
    setshowUpdateModal,
    showDeleteModal,
    setShowDeleteModal,
    status,
    name,
    setName,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    isChanged,
    setIsChanged,
    error,
    setError,
    resetStates,
  };
}
