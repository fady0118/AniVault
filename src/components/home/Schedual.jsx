import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jikanFetch } from "../../utility/jikanApi";

const classes = {
  dayClass: "day py-1 px-2 rounded-md hover:bg-dark-amethyst-smoke-400/10 dark:hover:bg-amethyst-smoke-400/10 hover:cursor-pointer duration-200",
  schedualClass: "w-full group text-[0.75em] flex flex-row px-3 py-1.5 gap-x-1.5 hover:saturation-125 hover:bg-blue-600/5 dark:hover:bg-blue-300/5 duration-200",
};

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
  const [currentIndex, setCurrentIndex] = useState(Number(date.getDay()) + OFFSET);
  
  const schedual = useQuery({
    queryKey: ["schedual", currentIndex],
    queryFn: async () => {
      const res = await jikanFetch(`https://api.jikan.moe/v4/schedules?filter=${days[currentIndex]?.long || ""}`);
      if (!res.ok) throw new Error(res.statusText);
      const schedual_Data = await res.json();
      const uniqueSchedualData = [...new Map(schedual_Data.data.map((item) => [item.mal_id, item])).values()];
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
    <div id="schedual" className="w-full xs:w-1/2 md:w-full flex flex-col items-center rounded-lg box-colors-lighter py-1 gap-y-1.5 h-fit min-h-64">
      <div id="schedualHeader" className="w-full flex flex-row items-center justify-evenly py-1">
        <ChevronLeft
          className="p-1 box-content rounded-full hover:bg-dark-amethyst-smoke-400/10 dark:hover:bg-amethyst-smoke-400/10 hover:cursor-pointer duration-200"
          onClick={() => {
            shift(-1);
          }}
        />
        <div ref={sliderRef} className="w-2/3 flex flex-row items-center gap-x-5 overflow-x-scroll no-scrollbar text-[0.7em] md:text-[0.85em]">
          {days.map((day, i) => (
            <div
              onClick={(e) => {
                setCurrentIndex(Number(e.target.dataset.index));
              }}
              className={`${classes.dayClass} ${i === currentIndex ? "active-tab" : ""}`}
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
          <div className="text-[0.8em] text-text-light-50 dark:text-text-dark-50 capitalize">Loading...</div>
        ) : (
          <div className="flex flex-col">
            <input type="checkbox" name="schedual-checkbox" id="schedual-checkbox" className="peer hidden" />
            {schedual?.data?.slice(0, 10).map((item) => (
              <a href={`/anime/${item.mal_id}`} key={item?.mal_id} className={`${classes.schedualClass}`}>
                <p className="text-text-light-50 dark:text-text-dark-50 group-hover:text-blue-600/70 dark:group-hover:text-blue-300/70 duration-200">{item?.broadcast?.time}</p>
                <p className="w-full group-hover:text-blue-600 dark:group-hover:text-blue-300 duration-200">{item?.title}</p>
              </a>
            ))}
            <div className="grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
              <div className="overflow-hidden">
                {schedual?.data?.slice(10).map((item) => (
                  <a href={`/anime/${item.mal_id}`} key={item?.mal_id} className={`${classes.schedualClass} `}>
                    <p className="text-text-light-50 dark:text-text-dark-50 group-hover:text-blue-600/70 dark:group-hover:text-blue-300/70 duration-200">{item?.broadcast?.time}</p>
                    <p className="w-full group-hover:text-blue-600 dark:group-hover:text-blue-300 duration-200">{item?.title}</p>
                  </a>
                ))}
              </div>
            </div>
            {schedual?.data?.length ? (
              <>
                <p className="px-3 text-[0.6em] text-text-light-50 dark:text-text-dark-50 capitalize">Timezone: {schedual?.data[0].broadcast.timezone}</p>
                {schedual?.data?.length > 10 ? (
                  <label
                    htmlFor="schedual-checkbox"
                    className="group flex flex-row w-full items-center justify-end px-3 gap-x-0.5 hover:cursor-pointer text-[0.6em] text-text-light-50 dark:text-text-dark-50 capitalize"
                  >
                    <p className="group-hover:text-blue-600 dark:group-hover:text-blue-300 duration-200 before:content-['see_more'] group-[.peer:checked_~_&]:before:content-['see_less']"></p>
                    <ChevronDown className="group-hover:stroke-blue-600 dark:group-hover:stroke-blue-300 duration-200 group-[.peer:checked_~_&]:rotate-180" size={12} />
                  </label>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}
