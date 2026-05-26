import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

export default function KeywordFilter({ registerCollector }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // keyword local state
  const [localState, setLocalState] = useState(() => searchParams.get("q") ?? "");
  // localRef
  const localRef = useRef(localState);

  useEffect(() => {
    // pass the getter to the parent (the getter passes the ref value)
    registerCollector(() => localRef.current);
  }, []);

  useEffect(() => {
    setLocalState(searchParams.get("q") ?? "");
  }, [searchParams]);

  // refresh ref on localState change
  useEffect(() => {
    localRef.current = localState;
  }, [localState]);

  // function updates only keyword in searchParams
  function handleKeywordFilter() {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      q: localRef.current,
    }));
  }

  return (
    <div id="search" className="header-box box-colors-stronger">
      <input
        className="outline-none"
        value={localState}
        onChange={(e) => {
          setLocalState(e.target.value);
        }}
        type="search"
        name="searchBar"
        id="searchBar"
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleKeywordFilter();
          }
        }}
      />
      <Search
        onClick={() => {
          handleKeywordFilter();
        }}
        className="hover:cursor-pointer hover:stroke-blue-500 duration-200"
        size={12}
      />
    </div>
  );
}
