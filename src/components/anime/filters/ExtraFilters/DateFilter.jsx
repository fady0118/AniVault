import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

export default function DateFilter({ data, registerCollector }) {
  const [searchParams] = useSearchParams();
  // localState for values capturing and local use
  const [localState, setLocalState] = useState({ start_date: searchParams.get(data[0]) || "", end_date: searchParams.get(data[1]) || "" });
  // localRef
  const localRef = useRef(localState);
  // ref to the checkbox used by the click outside function
  const checkboxRef = useRef(null);

  useEffect(() => {
    registerCollector(() => localRef.current);
  }, []);

  useEffect(() => {
    setLocalState({ start_date: searchParams.get(data[0]) || "", end_date: searchParams.get(data[1]) || "" });
  }, [searchParams]);

  // update ref
  useEffect(() => {
    localRef.current = localState;
  }, [localState]);

  function handleChange(type, val) {
    setLocalState((prevState) => {
      let newState = { ...prevState };
      const startDateValidationElm = document.getElementById("start_date-val_error");
      const endDateValidationElm = document.getElementById("end_date-val_error");
      if (type === "start_date") {
        if (new Date(newState.end_date) > new Date(val) || !newState.end_date || val=="") {
          newState.start_date = val;
          startDateValidationElm.classList.add("hidden");
          endDateValidationElm.classList.add("hidden");
        } else {
          startDateValidationElm.classList.remove("hidden");
        }
      } else if (type === "end_date") {
        if (new Date(newState.start_date) < new Date(val) || !newState.start_date || val=="") {
          newState.end_date = val;
          startDateValidationElm.classList.add("hidden");
          endDateValidationElm.classList.add("hidden");
        } else {
          endDateValidationElm.classList.remove("hidden");
        }
      }
      return newState;
    });
  }
  return (
    <>
      {data.map((type, i) => (
        <div key={i} className="flex flex-col h-fit text-3xs">
          <label className=" text-text-light/70 dark:text-text-dark/70 px-0.5" htmlFor={type}>
            {type.split("_").join(" ")}
          </label>
          <input
            className="dark:text-text-dark-50 text-text-light/50 outline-0 hover:cursor-pointer hover:text-text-light dark:hover:text-text-dark duration-200"
            type="date"
            placeholder=""
            name={type}
            id={type}
            value={localState[type]}
            onChange={(e) => {
              handleChange(type, e.target.value);
            }}
          />
          <p id={`${type}-val_error`} className="hidden text-[0.8em] px-0.5 text-rose-500 dark:text-red-400">
            {type === "start_date" ? "start date must be before end date" : "end date must be after start date"}
          </p>
        </div>
      ))}
    </>
  );
}
