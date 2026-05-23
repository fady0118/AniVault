import { ChevronDown } from "lucide-react";
import FilterItem from "./FilterItem";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

export default function FilterComponent({ keyName, data, registerCollector }) {
  const [searchParams] = useSearchParams();
  // localState for values capturing and local use
  const [localState, setLocalState] = useState(() => searchParams.get(keyName) ?? "");
  // localRef
  const localRef = useRef(localState);
  // state for dynamic heading/title
  const [heading, setHeading] = useState(keyName);

  // ref to the checkbox used by the click outside function
  const checkboxRef = useRef(null);

  useEffect(() => {
    // pass the getter to the parent (the getter passes the ref value)
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

  function handleChange(val) {
    // needs rework
    setLocalState((prevState) => {
      let prevStateItems = prevState ? prevState.split(",") : [];
      if (prevStateItems.includes(val)) {
        prevStateItems = prevStateItems.filter((item) => item !== val);
      } else {
        prevStateItems.push(val);
      }
      return prevStateItems.join(",");
    });
  }

  // update heading/title of the component
  function filterComponentTitle() {
    let heading = keyName;
    const searchParamsString = localState;
    if (!searchParamsString) {
      setHeading(heading);
      return;
    }
    searchParamsString.split(",").length > 1 ? (heading = `${searchParamsString.split(",")[0]} + [${searchParamsString.split(",").length - 1}]`) : (heading = searchParamsString);
    setHeading(heading);
  }

  // trigger heading update & refresh ref on localState change
  useEffect(() => {
    filterComponentTitle();
    localRef.current = localState;
  }, [localState]);

  return (
    <div id={keyName} className="group relative w-36">
      <label className="group peer w-full header-box box-colors-stronger hover:cursor-pointer">
        <input ref={checkboxRef} type="checkbox" className="hidden" />
        <p className="text-text-light-70 dark:text-text-dark-70 group-hover:text-text-light dark:group-hover:text-text-dark">{heading}</p>
        <ChevronDown size={14} className="group-has-checked:rotate-180 duration-200" />
      </label>
      <div className="absolute top-6 left-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-full p-2 text-2xs/loose">
        {data.map((item, i) => (
          <FilterItem key={i} keyName={keyName} item={item} localState={localState} handleChange={handleChange} />
        ))}
      </div>
    </div>
  );
}
