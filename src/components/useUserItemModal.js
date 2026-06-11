import { useState } from "react";
import UserItemModal from "./UserItemModal";

export function useUserItemModal() {
  const [showUserItemModal, setShowUserItemModal] = useState(false);
  const [userItemData, setUserItemData] = useState(null);
  return { showUserItemModal, setShowUserItemModal, userItemData, setUserItemData, UserItemModal };
}
