import { useReducer, useState } from "react";

// image gallery
function galleryReducer(state, action, items) {
  switch (action.type) {
    case "next":
      return { activeIndex: state.activeIndex >= items.length - 1 ? 0 : state.activeIndex + 1 };
    case "prev":
      return { activeIndex: state.activeIndex <= 0 ? items.length - 1 : state.activeIndex - 1 };
    case "open":
      return { activeIndex: action.newIndex };
    case "close":
      return { activeIndex: null };
  }
}

export default function useGallery(items = []) {
  const [showModal, setShowModal] = useState(false);
  const [state, dispatch] = useReducer((state, action) => galleryReducer(state, action, items), { activeIndex: null });

  function openGallery(index) {
    dispatch({ type: "open", newIndex: index });
    setShowModal(true);
  }
  function closeGallery() {
    dispatch({ type: "close" });
    setShowModal(false);
  }

  return { dispatch, showModal, openGallery, closeGallery, activeIndex: state.activeIndex };
}
