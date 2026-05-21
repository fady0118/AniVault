import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const dayClass = "day p-1 rounded-md hover:bg-dark-amethyst-smoke-400/10 dark:hover:bg-amethyst-smoke-400/10 hover:cursor-pointer duration-200";
export default function Schedual() {
  const baseDays = [
    { long: "sunday", short: "SUN" },
    { long: "monday", short: "MON" },
    { long: "tuesday", short: "TUE" },
    { long: "wednesday", short: "WED" },
    { long: "thursday", short: "THU" },
    { long: "friday", short: "FRI" },
    { long: "saturday", short: "SAT" },
  ];
  const days = [...baseDays, ...baseDays, ...baseDays];
  const OFFSET = 7;
  const date = new Date();
  const sliderRef = useRef(null);
  //   const indexRef = useRef(Number(date.getDay()) + OFFSET);
  const [currentIndex, setCurrentIndex] = useState(Number(date.getDay()) + OFFSET);
  const schedual = useQuery({
    queryKey: ["schedual", currentIndex],
    queryFn: async () => {
      const res = await fetch(`https://api.jikan.moe/v4/schedules?filter=${days[currentIndex]?.long || ""}`);
      if (!res.ok) throw new Error(res.statusText);
      const schedual_Data = await res.json();
      const uniqueSchedualData = [...new Set(schedual_Data.data.map((elm) => elm.mal_id))].map((id) => schedual_Data.data.find((item) => item.mal_id === id));
      return uniqueSchedualData;
    },
  });

  function scrollIntoView(index, animate = true) {
    const container = sliderRef.current;
    if (!container) return;
    const dayNodes = container.querySelectorAll("div.day");
    const dayNode = dayNodes[index];
    if (!dayNode) return;
    // rects
    const containerRect = container.getBoundingClientRect();
    const nodeRect = dayNode.getBoundingClientRect();
    // calculation
    const left = container.scrollLeft + (nodeRect.left - containerRect.left) - container.clientWidth / 2 + nodeRect.width / 2;
    container.scrollTo({ left, behavior: animate ? "smooth" : "instant" });
  }
  function shift(dir) {
    setCurrentIndex((s) => s + dir);
    // after scrolling into a clone move back
    if (currentIndex >= OFFSET * 2) {
      // reached end pos
      setCurrentIndex((s) => s - OFFSET);
    } else if (currentIndex < OFFSET) {
      // reached start pos
      setCurrentIndex((s) => s + OFFSET);
    }
  }
  useEffect(() => {
    scrollIntoView(currentIndex);
  }, [currentIndex]);
  return (
    <div id="schedual" className="w-full flex flex-col items-center rounded-lg box-colors py-2 gap-y-3 mt-3 h-fit">
      <div id="schedualHeader" className="w-full flex flex-row items-center justify-evenly">
        <ChevronLeft
          className="p-1 box-content rounded-full hover:bg-dark-amethyst-smoke-400/10 dark:hover:bg-amethyst-smoke-400/10 hover:cursor-pointer duration-200"
          onClick={() => {
            shift(-1);
          }}
        />
        <div ref={sliderRef} className="w-2/3 flex flex-row items-center gap-x-5 overflow-x-scroll no-scrollbar text-[0.85em]">
          {days.map((day, i) => (
            <div
              onClick={(e) => {
                setCurrentIndex(Number(e.target.dataset.index));
              }}
              className={`${dayClass} ${i === currentIndex ? "active-tab" : ""}`}
              data-index={i}
              key={i}
            >
              {day.short}
            </div>
          ))}
        </div>
        <ChevronRight
          className="p-1 box-content rounded-full hover:bg-dark-amethyst-smoke-400/10 dark:hover:bg-amethyst-smoke-400/10 hover:cursor-pointer duration-200"
          onClick={() => {
            shift(1);
          }}
        />
      </div>
      <div>
        {schedual?.isPending ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col gap-y-1.5 px-3 py-1">
            {schedual?.data?.map((item) => (
              <div key={item?.mal_id} className="w-full">
                <p className="w-full text-[0.75em]">{item?.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
