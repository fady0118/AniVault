import { useState } from "react";

export function useUserItemModal() {
  // for setting item jikanData used if the caller already has the data otherwise it is null and the modal fetches it
  const [userItemData, setUserItemData] = useState(null);
  // show/hide modal
  const [showUserItemModal, setShowUserItemModal] = useState(false);
  return { showUserItemModal, setShowUserItemModal, userItemData, setUserItemData };
}
