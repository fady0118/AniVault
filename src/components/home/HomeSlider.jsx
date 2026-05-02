import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Slide from "./Slide";
import TrailerModal from "./TrailerModal";

export default function HomeSlider({ season }) {
  if (!season.length) return;
  const [indexState, setIndexState] = useState(1);
  const sliderRef = useRef(null);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  function scrollIntoView(index) {
    const slideNode = sliderRef.current.querySelectorAll("div.slide")[index];
    const offsetLeft = slideNode.offsetLeft;
    sliderRef.current.scrollTo({ left: offsetLeft, behavior: index === 0 ? "auto" : "smooth", block: "nearest", inline: "center" });
    setIndexState(index + 1);
  }
  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % season.length;
      scrollIntoView(indexRef.current);
    }, 5000);
  }, []);

  useEffect(() => {
    sliderRef.current.scrollTo({ left: 0, behavior: "auto" });
    startInterval();

function slideNavigating(e) {
      console.log(e.key)
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
  const trailerRef = useRef(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  function openModal(trailerLink) {
    trailerRef.current = trailerLink;
    setShowTrailerModal(true);
    // pause the interval
    clearInterval(intervalRef.current);
  }
  function closeModal() {
    trailerRef.current = null;
    setShowTrailerModal(false);
    // resume the interval
    startInterval();
  }

  return (
    <>
      <div id="slider" className="relative w-full rounded-xl left-1/2 -translate-x-1/2 h-screen flex overflow-y-hidden overflow-x-scroll no-scrollbar" ref={sliderRef}>
        {season.map((animeData, i) => (
          <Slide key={i} animeData={animeData} openModal={openModal} />
        ))}
      </div>
      <div
        id="manualControls"
        className="w-20 xs:w-26 sm:w-30 md:w-38 lg:w-48 absolute top-[40vh] sm:top-[80vh] right-[7vw] flex justify-between items-center p-0 md:py-1.5 md:px-2.5 text-text-light dark:text-text-dark text-shadow-2xs text-shadow-amethyst-smoke-300/50 dark:text-shadow-dark-amethyst-smoke-50/50 rounded-xl bg-amethyst-smoke-400/60 dark:bg-dark-amethyst-smoke-400/60"
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
      <div className="hidden sm:block absolute z-50 w-screen h-screen top-0 bg-[linear-gradient(0deg,#e7e6ee_0%,transparent_5%)] dark:bg-[linear-gradient(0deg,#1b1e1f_0%,transparent_5%)] pointer-events-none"></div>
      {showTrailerModal && trailerRef.current && <TrailerModal closeModal={closeModal} link={trailerRef.current} />}
    </>
  );
}
