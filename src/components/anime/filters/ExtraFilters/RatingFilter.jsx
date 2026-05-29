import { ChevronDown, Square, SquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

export default function RatingFilter({ data, registerCollector, view }) {
  const [searchParams] = useSearchParams();
  const [heading, setHeading] = useState("rating");
  // localState for values capturing and local use
  const [localState, setLocalState] = useState(searchParams.get("rating") || "");
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

  useEffect(() => {
    setLocalState(searchParams.get("rating") || "");
  }, [searchParams]);

  useEffect(() => {
    // update ref
    localRef.current = localState;
    // update heading
    filterComponentTitle();
  }, [localState]);

  // update heading/title of the component
  function filterComponentTitle() {
    localRef.current === "" ? setHeading("rating") : setHeading(localRef.current);
  }

  return (
    <>
      {!view ? (
        <div id="rating" className="relative">
          <label className="group peer w-full header-box box-colors-stronger hover:cursor-pointer">
            <input ref={checkboxRef} type="checkbox" className="hidden" />
            <p className="text-text-light-70 dark:text-text-dark-70 group-hover:text-text-light dark:group-hover:text-text-dark">{heading}</p>
            <ChevronDown size={14} className="group-has-checked:rotate-180 duration-200" />
          </label>
          <div className="absolute top-6 left-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-full p-2 ">
            {data.map((item, i) => (
              <div
                key={i}
                id={item}
                onClick={() => {
                  setLocalState((prevState) => (prevState === item ? "" : item));
                }}
                className={`w-full flex flex-row items-center justify-between px-1 rounded-xs hover:cursor-pointer ${localState === item ? "bg-emerald-500/50 hover:bg-emerald-400/75" : "hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75"}`}
              >
                <div className="flex flex-row items-center gap-x-0.5">
                  <>
                    {localState === item ? <SquarePlus className="stroke-2 stroke-emerald-500 fill-amethyst-smoke-200" size={12} /> : <Square className="stroke-0 fill-amethyst-smoke-200" size={12} />}
                  </>
                  <p className={`${item.length > 3 ? "capitalize" : "uppercase"}`}>{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div id="rating" className=" relative w-full text-2xs/loose">
          <label className="group peer w-full small-header-box smallHeaderBox-colors hover:cursor-pointer">
            <input ref={checkboxRef} type="checkbox" className="hidden" />
            <p className="text-text-light-70 dark:text-text-dark-70 group-hover:text-text-light dark:group-hover:text-text-dark">{heading}</p>
            <ChevronDown size={14} className="group-has-checked:rotate-180 duration-200" />
          </label>
          <div className="z-30 absolute top-6 left-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-full p-2 ">
            {data.map((item, i) => (
              <div
                key={i}
                id={item}
                onClick={() => {
                  setLocalState((prevState) => (prevState === item ? "" : item));
                }}
                className={`w-full flex flex-row items-center justify-between px-1 rounded-xs hover:cursor-pointer ${localState === item ? "bg-emerald-500/50 hover:bg-emerald-400/75" : "hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75"}`}
              >
                <div className="flex flex-row items-center gap-x-0.5 text-3xs">
                  <>
                    {localState === item ? <SquarePlus className="stroke-2 stroke-emerald-500 fill-amethyst-smoke-200" size={12} /> : <Square className="stroke-0 fill-amethyst-smoke-200" size={12} />}
                  </>
                  <p className={`${item.length > 3 ? "capitalize" : "uppercase"}`}>{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
