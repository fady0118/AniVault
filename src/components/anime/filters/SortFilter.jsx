import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import SortItem from "./SortItem";

export default function SortFilter({ registerCollector, data }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localState, setLocalState] = useState({ order_by: searchParams.get("order_by") || "start_date", sort: searchParams.get("sort") || "desc" });
  const sortRef = useRef(null);
  const checkboxRef = useRef(null);
  useEffect(() => {
    // pass the getter to the parent (the getter passes the ref value)
    registerCollector(() => sortRef.current);
    // uncheck the checkbox if the user clicks anywhere outside the div wrapping the checkbox
    const handleClickOutside = (e) => {
      if (checkboxRef.current && !checkboxRef.current.closest("div").contains(e.target)) {
        checkboxRef.current.checked = false;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalState({ order_by: searchParams.get("order_by") || "start_date", sort: searchParams.get("sort") || "desc" });
  }, [searchParams]);

  useEffect(() => {
    sortRef.current = localState;
  }, [localState]);

  function handleOrderChange(val) {
    setLocalState((prevState) => {
      const newState = prevState.order_by === val ? { ...prevState, order_by: "" } : { ...prevState, order_by: val };
      return newState;
    });
  }
  function handleSortChange() {
    setLocalState((prevState) => {
      const newState = prevState.sort === "" ? { ...prevState, sort: "asc" } : prevState.sort === "asc" ? { ...prevState, sort: "desc" } : { ...prevState, sort: "" };
      return newState;
    });
  }
  return (
    <div className="flex flex-row items-center gap-x-2">
      <div id="orderBy" className="group relative max-w-28">
        <label className="group peer w-full header-box box-colors-stronger hover:cursor-pointer">
          <input ref={checkboxRef} type="checkbox" className="hidden" />
          <p className="text-text-light-70 dark:text-text-dark-70 group-hover:text-text-light dark:group-hover:text-text-dark">{localState.order_by.split("_").join(" ") || "order by"}</p>
          <ChevronDown size={14} className="group-has-checked:rotate-180 duration-200 ml-1" />
        </label>
        <div className="absolute top-6 left-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-28 p-2 text-2xs/loose">
          {data.map((item, i) => (
            <SortItem key={i} item={item} localState={localState} handleChange={handleOrderChange} />
          ))}
        </div>
      </div>
      <div id="sort" onClick={handleSortChange} className="box-colors rounded-md px-0.5 py-1 hover:brightness-110 hover:cursor-pointer duration-200">
        {localState.sort === "asc" ? (
          <>
            <ChevronDown className="rotate-180" size={14} />
          </>
        ) : localState.sort === "desc" ? (
          <>
            <ChevronDown size={14} />
          </>
        ) : (
          <>
            <ChevronsUpDown size={14} />
          </>
        )}
      </div>
    </div>
  );
}
