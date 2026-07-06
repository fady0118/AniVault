import { useRef, useState } from "react";

export function useVideoModal() {
  const videoRef = useRef(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  function playVideo(videoLink) {
    videoRef.current = videoLink;
    setShowVideoModal(true);
  }
  function closeVideo() {
    videoRef.current = null;
    setShowVideoModal(false);
  }

  return { showVideoModal, videoRef, playVideo, closeVideo };
}
