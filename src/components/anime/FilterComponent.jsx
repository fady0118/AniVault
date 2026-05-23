import { ChevronDown } from "lucide-react";
import FilterItem from "./FilterItem";
import { useEffect, useRef, useState } from "react";

export default function FilterComponent({ keyName, data, handleSearchParam, searchParams }) {
  const [heading, setHeading] = useState(keyName);

  const checkboxRef = useRef(null);

  // uncheck the checkbox if the user clicks anywhere outside the div wrapping the checkbox
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (checkboxRef.current && !checkboxRef.current.closest("div").contains(e.target)) {
        checkboxRef.current.checked = false;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function filterComponentTitle() {
    let heading = keyName;
    const searchParamsstring = searchParams.get(keyName);
    if (searchParams.getAll(keyName).length !== 0) {
      searchParamsstring.split(",").length === 1 ? (heading = searchParamsstring) : (heading = `${searchParamsstring.split(",")[0]} + [${searchParamsstring.split(",").length - 1}]`);
    }
    setHeading(heading);
  }

  useEffect(() => {
    filterComponentTitle();
  }, [searchParams]);
  return (
    <div id={keyName} className="group relative w-36">
      <label className="group peer w-full header-box box-colors-stronger hover:cursor-pointer">
        <input ref={checkboxRef} type="checkbox" className="hidden" />
        <p className="text-text-light-70 dark:text-text-dark-70 group-hover:text-text-light dark:group-hover:text-text-dark">{heading}</p>
        <ChevronDown size={14} className="group-has-checked:rotate-180 duration-200" />
      </label>
      <div className="absolute top-6 left-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-full p-2 text-2xs/loose">
        {data.map((item, i) => (
          <FilterItem key={i} keyName={keyName} item={item} handleSearchParam={handleSearchParam} searchParams={searchParams} filterComponentTitle={filterComponentTitle} />
        ))}
      </div>
    </div>
  );
}
