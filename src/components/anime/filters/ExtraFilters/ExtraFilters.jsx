import { Settings2 } from "lucide-react";
import { useEffect, useRef } from "react";
import ScoreFilter from "./ScoreFilter";

export default function ExtraFilters() {
  const checkboxRef = useRef(null);

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
      <div id="Filters" className="">
        <label className="group peer w-full p-1 flex flex-row items-center justify-between rounded-md box-colors-stronger hover:cursor-pointer hover:brightness-110 duration-200">
          <input ref={checkboxRef} type="checkbox" className="hidden" />
          <Settings2 size={16} className="stroke-text-light-70 dark:stroke-text-dark-70 group-hover:stroke-text-light dark:group-hover:stroke-text-dark" />
        </label>
        <div className="absolute top-6 right-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-4 gap-1 w-md p-2">
          <ScoreFilter/>
          <p>rating</p>
          <p>start date</p>
          <p>end date</p>
        </div>
      </div>
    </>
  );
}
