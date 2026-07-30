import { useRef, useState } from "react";

export function useVideoModal() {
  const videoRef = useRef(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  function playVideo(videoData) {
    videoRef.current = videoData;
    setShowVideoModal(true);
  }
  function closeVideo() {
    videoRef.current = null;
    setShowVideoModal(false);
  }

  return { showVideoModal, videoRef, playVideo, closeVideo };
}
