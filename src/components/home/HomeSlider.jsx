import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import Slide from "./Slide";

export default function HomeSlider({ season }) {
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
      <div id="slider" className="relative w-full rounded-xl left-1/2 -translate-x-1/2 h-[75vh] flex overflow-y-hidden overflow-x-scroll no-scrollbar" ref={sliderRef}>
        {season.map((animeData, i) => (
          <Slide key={i} animeData={animeData} />
        ))}
      </div>
      <div id="manualControls" className="w-full absolute top-1/2 left-1/2 -translate-1/2 flex justify-between items-center px-4">
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
