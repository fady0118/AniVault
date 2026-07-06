import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Slide from "./Slide";
import VideoModal from "../VideoModal";
import { useVideoModal } from "../../utility/useVideoModal";

export default function HomeSlider({ season }) {
  if (!season?.length) return;
  const [indexState, setIndexState] = useState(1);
  const sliderRef = useRef(null);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  function scrollIntoView(index) {
    const container = sliderRef.current;
    if (!container) return;
    const slideNodes = container.querySelectorAll("div.slide");
    const slideNode = slideNodes[index];
    if (!slideNode) return;
    const containerRect = container.getBoundingClientRect();
    const nodeRect = slideNode.getBoundingClientRect();
    const left = container.scrollLeft + (nodeRect.left - containerRect.left) - container.clientWidth / 2 + nodeRect.width / 2;
    container.scrollTo({ left, behavior: "smooth" });
    setIndexState(index + 1);
  }
  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % season.length;
      scrollIntoView(indexRef.current);
    }, 4000);
  }, []);

  useEffect(() => {
    sliderRef.current.scrollTo({ left: 0, behavior: "auto" });
    startInterval();

    function slideNavigating(e) {
      if (e.key === "ArrowRight") {
        indexRef.current = (indexRef.current + 1) % season.length;
        scrollIntoView(indexRef.current);
      } else if (e.key === "ArrowLeft") {
        indexRef.current = indexRef.current > 0 ? indexRef.current - 1 : season.length - 1;
        scrollIntoView(indexRef.current);
      }
    }
    document.documentElement.addEventListener("keydown", slideNavigating);

    return () => {
      document.documentElement.removeEventListener("keydown", slideNavigating);
      clearInterval(intervalRef.current);
    };
  }, []);

  // trailer modal
  const { showVideoModal, videoRef, playVideo, closeVideo } = useVideoModal();
  function openModal(trailerLink) {
    playVideo(trailerLink);
    // pause the interval
    clearInterval(intervalRef.current);
  }
  function closeModal() {
    closeVideo();
    // resume the interval
    startInterval();
  }

  return (
    <>
      <div className="w-fit h-fit">
        <div id="slider" className="relative w-full rounded-xl left-1/2 -translate-x-1/2 h-[90vh] flex overflow-y-hidden overflow-x-scroll no-scrollbar" ref={sliderRef}>
          {season.map((animeData, i) => (
            <Slide key={i} animeData={animeData} openModal={openModal} />
          ))}
        </div>
        <div className="hidden sm:block absolute z-40 w-screen h-[90vh] top-0 bg-[linear-gradient(0deg,#e7e6ee_0%,transparent_5%)] dark:bg-[linear-gradient(0deg,#1b1e1f_0%,transparent_5%)] pointer-events-none"></div>
      </div>
      <div
        id="manualControls"
        className="w-20 xs:w-26 sm:w-30 md:w-38 lg:w-48 absolute top-[40vh] sm:top-[60vh] right-[7vw] flex justify-between items-center p-0 md:py-1.5 md:px-2.5 text-text-light dark:text-text-dark text-shadow-2xs text-shadow-amethyst-smoke-300/50 dark:text-shadow-dark-amethyst-smoke-50/50 rounded-xl bg-amethyst-smoke-400/60 dark:bg-dark-amethyst-smoke-400/60"
      >
        <ChevronLeft
          size={30}
          onClick={() => {
            clearInterval(intervalRef.current);
            if (indexRef.current <= 0) {
              indexRef.current = season.length - 1;
              scrollIntoView(indexRef.current);
              startInterval();
            } else {
              indexRef.current = indexRef.current - 1;
              scrollIntoView(indexRef.current);
              startInterval();
            }
          }}
          className="p-1 box-content rounded-full hover:bg-amethyst-smoke-700/30 hover:cursor-pointer hover:text-amethyst-smoke-50 duration-300"
        />
        <div className="w-3/4 flex justify-evenly items-center text-[0.6rem] xs:text-xs sm:text-sm md:text-md">
          <span className="font-bold">{indexState}</span>
          <span className="text-md md:text-xl">/</span>
          <span className="font-light">{season.length}</span>
        </div>
        <ChevronRight
          size={30}
          onClick={() => {
            clearInterval(intervalRef.current);
            indexRef.current = (indexRef.current + 1) % season.length;
            scrollIntoView(indexRef.current);
            startInterval();
          }}
          className="p-1 box-content rounded-full hover:bg-amethyst-smoke-700/30 hover:cursor-pointer"
        />
      </div>
      {showVideoModal && videoRef.current && <VideoModal closeModal={closeModal} link={videoRef.current} />}
    </>
  );
}
