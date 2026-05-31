import { Settings2 } from "lucide-react";
import { useEffect, useRef } from "react";
import ScoreFilter from "./ScoreFilter";
import RatingFilter from "./RatingFilter";
import DateFilter from "./DateFilter";

const ratingData = ["g", "pg", "pg13", "r17", "r", "rx"];
const dateTypesData = ["start_date", "end_date"];
export default function ExtraFilters({ registerCollectors, view }) {
  const checkboxRef = useRef(null);
  const extraFiltersBtnRef = useRef(null);
  const extraFiltersRef = useRef(null);

  function calcDim() {
    if (!extraFiltersBtnRef.current || !extraFiltersRef.current) return;
    const btnRect = extraFiltersBtnRef.current.getBoundingClientRect();
    const header = document.getElementById("header");
    if (!header) return;
    const contRect = header.getBoundingClientRect();
    const width = extraFiltersRef.current.offsetWidth || 337;
    const left = btnRect.left - contRect.left;

    if (width + btnRect.left <= contRect.right) {
      extraFiltersRef.current.style.left = `${Math.max(0, left)}px`;
      extraFiltersRef.current.style.right = "";
      extraFiltersRef.current.style.top = `${contRect.bottom - contRect.top + 2}px`;
    } else {
      extraFiltersRef.current.style.left = "";
      extraFiltersRef.current.style.right = "0px";
      extraFiltersRef.current.style.top = `${contRect.bottom - contRect.top + 2}px`;
    }
  }

  useEffect(() => {
    // uncheck the checkbox if the user clicks anywhere outside the div wrapping the checkbox
    const handleClickOutside = (e) => {
      if (checkboxRef.current && !checkboxRef.current.closest("div").contains(e.target)) {
        checkboxRef.current.checked = false;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      {!view ? (
        // large screens
        <div id="Filters" className="">
          <label className="group peer w-full p-1 flex flex-row items-center justify-between rounded-md box-colors-stronger hover:cursor-pointer hover:brightness-110 duration-200">
            <input ref={checkboxRef} type="checkbox" className="hidden" />
            <Settings2 onClick={calcDim} ref={extraFiltersBtnRef} size={16} className="stroke-text-light-70 dark:stroke-text-dark-70 group-hover:stroke-text-light dark:group-hover:stroke-text-dark" />
          </label>
          <div
            ref={extraFiltersRef}
            className={`absolute hidden peer-has-checked:grid rounded-md box-colors-stronger ${registerCollectors?.ratingCollector ? "grid-cols-4" : "grid-cols-3"} gap-1 p-2 `}
          >
            <ScoreFilter registerCollector={registerCollectors.scoreCollector} />
            {registerCollectors?.ratingCollector ? <RatingFilter data={ratingData} registerCollector={registerCollectors.ratingCollector} /> : ""}
            <DateFilter data={dateTypesData} registerCollector={registerCollectors.dateCollector} />
          </div>
        </div>
      ) : (
        // small screens
        <>
          <div id="Filters" className="w-full max-w-40">
            <label className="group peer w-fit p-1 flex flex-row items-center justify-between rounded-md  smallHeaderBox-colors hover:cursor-pointer hover:brightness-110 duration-200">
              <input type="checkbox" className="hidden" />
              <Settings2 size={16} className="stroke-text-light-70 dark:stroke-text-dark-70 group-hover:stroke-text-light dark:group-hover:stroke-text-dark" />
            </label>
            <div className="mt-1 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1.5 p-2">
              <ScoreFilter registerCollector={registerCollectors.scoreCollector} view="mobile" />
              {registerCollectors?.ratingCollector ? <RatingFilter data={ratingData} registerCollector={registerCollectors.ratingCollector} view="mobile" /> : ""}
              <DateFilter data={dateTypesData} registerCollector={registerCollectors.dateCollector} view="mobile" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
