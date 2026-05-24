import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

export default function ScoreFilter({ registerCollector }) {
  const [searchParams] = useSearchParams();
  // localState for values capturing and local use
  const [localState, setLocalState] = useState({ min_score: searchParams.get("min_score") ?? "0", max_score: searchParams.get("max_score") ?? "10" });
  // localRef
  const localRef = useRef(localState);
  // ref to the checkbox used by the click outside function
  const checkboxRef = useRef(null);

  useEffect(() => {
    registerCollector(() => localRef.current);
    // uncheck the checkbox if the user clicks anywhere outside the div wrapping the checkbox
    const handleClickOutside = (e) => {
      if (checkboxRef.current && !checkboxRef.current.closest("div").contains(e.target)) {
        checkboxRef.current.checked = false;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // update ref
  useEffect(() => {
    localRef.current = localState;
  }, [localState]);

  function changeMinRadio(e) {
    const val = Number(e.target.value);
    setLocalState((prevState) => ({ ...prevState, min_score: Math.min(val, prevState.max_score) }));
  }
  function changeMaxRadio(e) {
    const val = Number(e.target.value);
    setLocalState((prevState) => ({ ...prevState, max_score: Math.max(val, prevState.min_score) }));
  }

  return (
    <div id="score" className=" relative w-36">
      <label className="group peer w-full header-box box-colors-stronger hover:cursor-pointer">
        <input ref={checkboxRef} type="checkbox" className="hidden" />
        <p className="text-text-light-70 dark:text-text-dark-70 group-hover:text-text-light dark:group-hover:text-text-dark">Score</p>
        <ChevronDown size={14} className="group-has-checked:rotate-180 duration-200" />
      </label>
      <div className="absolute top-6 left-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-full p-2 text-2xs/loose">
        <label htmlFor="max-score-input">
          max score
          <input onChange={changeMaxRadio} type="range" min="0" max="10" value={localState.max_score} className="range range-xs w-[166%] origin-left scale-60 range-primary" />
        </label>
        <label htmlFor="min-score-input">
          min score
          <input onChange={changeMinRadio} type="range" min="0" max="10" value={localState.min_score} className="range range-xs w-[166%] origin-left scale-60 range-primary" />
        </label>
      </div>
    </div>
  );
}
