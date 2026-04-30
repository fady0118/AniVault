import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Slide from "./Slide";

export default function HomeSlider({ season }) {
  const [indexState, setIndexState] = useState(1);
  const sliderRef = useRef(null);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  function scrollIntoView(index) {
    const slideNode = sliderRef.current.querySelectorAll("div.slide")[index];
    if (index === 0) {
      slideNode.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
    } else {
      slideNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    setIndexState(index+1)
  }
  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % season.length;
      scrollIntoView(indexRef.current);
    }, 10000);
  }, []);

  useEffect(() => {
    sliderRef.current.scrollTo({ left: 0, behavior: "auto" });
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <div id="slider" className="relative w-full rounded-xl left-1/2 -translate-x-1/2 h-screen flex overflow-y-hidden overflow-x-scroll no-scrollbar" ref={sliderRef}>
        {season.map((animeData, i) => (
          <Slide key={i} animeData={animeData} />
        ))}
      </div>
      <div id="manualControls" className="w-20 xs:w-26 sm:w-30 md:w-38 lg:w-48 absolute top-[80vh] right-[7vw] flex justify-between items-center p-0 md:py-1.5 md:px-2.5 text-text-light dark:text-text-dark  text-shadow-lg text-shadow-amethyst-smoke-300/50 dark:text-shadow-dark-amethyst-smoke-50/50 rounded-xl bg-amethyst-smoke-400/50 dark:bg-dark-amethyst-smoke-400/50">
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
          className="p-1 box-content rounded-full hover:bg-amethyst-smoke-700/30 hover:cursor-pointer"
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
    </>
  );
}
