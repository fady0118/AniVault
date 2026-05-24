import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import GenreItem from "./GenreItem";
import { ChevronDown } from "lucide-react";

export default function GenresFilter({ data, registerCollector }) {
  const [searchParams] = useSearchParams();
  const [heading, setHeading] = useState("genres");

  const [localState, setLocalState] = useState(() => {
    const genresParams = searchParams.get("genres")?.split(",") || [];
    const genresExcludeParams = searchParams.get("genres_exclude")?.split(",") || [];
    return Object.fromEntries(data.map((genre) => [genre.mal_id, genresParams.includes(String(genre.mal_id)) ? 1 : genresExcludeParams.includes(String(genre.mal_id)) ? -1 : 0]));
  });

  // localRef
  const localRef = useRef(null);
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

  // update heading/title of the component
  function filterComponentTitle() {
    let heading = "Genres";
    const selectedGenresArr = localRef.current.genres.concat(localRef.current.genres_exclude);
    if (!selectedGenresArr.length) {
      setHeading(heading);
      return;
    }
    selectedGenresArr.length > 1
      ? (heading = `${data.find((item) => item.mal_id == selectedGenresArr[0]).name} + [${selectedGenresArr.length - 1}]`)
      : (heading = data.find((item) => item.mal_id == selectedGenresArr[0]).name);
    setHeading(heading);
  }

  useEffect(() => {
    setGenresRef(localRef);
    filterComponentTitle();
  }, [localState]);

  function handleClick(mal_id) {
    setLocalState((prevState) => {
      const current = prevState[mal_id];
      const next = current === 0 ? 1 : current === 1 ? -1 : 0;
      return { ...prevState, [mal_id]: next };
    });
  }
  function setGenresRef(ref) {
    ref.current = { genres: [], genres_exclude: [] };
    Object.entries(localState).forEach(([mal_id, value]) => {
      if (value === 1) localRef.current.genres.push(Number(mal_id));
      else if (value === -1) localRef.current.genres_exclude.push(Number(mal_id));
    });
  }

  return (
    <>
      <div id="genre" className="group relative w-36">
        <label className="group peer w-full header-box box-colors-stronger hover:cursor-pointer">
          <input ref={checkboxRef} type="checkbox" className="hidden" />
          <p className="text-text-light-70 dark:text-text-dark-70 group-hover:text-text-light dark:group-hover:text-text-dark">{heading}</p>
          <ChevronDown size={14} className="group-has-checked:rotate-180 duration-200" />
        </label>
        <div className="absolute top-6 right-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-4 gap-1 w-md p-2 text-3xs/relaxed">
          {data.map((item, i) => (
            <GenreItem key={i} mal_id={item.mal_id} name={item.name} localState={localState} handleClick={handleClick} />
          ))}
        </div>
      </div>
    </>
  );
}
