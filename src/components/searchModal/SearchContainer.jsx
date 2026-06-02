import { useQueries } from "@tanstack/react-query";
import { jikanFetch } from "../../utility/jikanApi";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function SearchContainer({ searchInput, category, closeModal }) {
  const [recentSearches, setRecentSearches] = useState([]);
  const [animeSearchQ, mangaSearchQ, charactersSearchQ, producersSearchQ, peopleSearchQ] = useQueries({
    queries: [
      {
        queryKey: ["animeSearch", searchInput, category],
        queryFn: async () => {
          if (!searchInput) throw new Error("search term is null");
          const res = await jikanFetch(`https://api.jikan.moe/v4/anime?q=${searchInput}&order_by=favorites&sort=desc`);
          if (!res.ok) throw new Error(res.statusText);
          const animeData = await res.json();
          const uniqueAnimeData = [...new Map(animeData?.data.map((item) => [item.mal_id, item])).values()];
          return { data: uniqueAnimeData, pagination: animeData.pagination };
        },
        enabled: Boolean(searchInput) && (category === "all" || category === "anime"),
      },
      {
        queryKey: ["mangaSearch", searchInput, category],
        queryFn: async () => {
          if (!searchInput) throw new Error("search term is null");
          const res = await jikanFetch(`https://api.jikan.moe/v4/manga?q=${searchInput}&order_by=favorites&sort=desc`);
          if (!res.ok) throw new Error(res.statusText);
          const mangaData = await res.json();
          const uniqueMangaData = [...new Map(mangaData?.data.map((item) => [item.mal_id, item])).values()];
          return { data: uniqueMangaData, pagination: mangaData.pagination };
        },
        enabled: Boolean(searchInput) && (category === "all" || category === "manga"),
      },
      {
        queryKey: ["charactersSearch", searchInput, category],
        queryFn: async () => {
          if (!searchInput) throw new Error("search term is null");
          const res = await jikanFetch(`https://api.jikan.moe/v4/characters?q=${searchInput}&order_by=favorites&sort=desc`);
          if (!res.ok) throw new Error(res.statusText);
          const charactersData = await res.json();
          const uniqueCharactersData = [...new Map(charactersData?.data.map((item) => [item.mal_id, item])).values()];
          return { data: uniqueCharactersData, pagination: charactersData.pagination };
        },
        enabled: Boolean(searchInput) && (category === "all" || category === "characters"),
      },
      {
        queryKey: ["producersSearch", searchInput, category],
        queryFn: async () => {
          if (!searchInput) throw new Error("search term is null");
          const res = await jikanFetch(`https://api.jikan.moe/v4/producers?q=${searchInput}&order_by=favorites&sort=desc`);
          if (!res.ok) throw new Error(res.statusText);
          const producersData = await res.json();
          const uniqueProducersData = [...new Map(producersData?.data.map((item) => [item.mal_id, item])).values()];
          return { data: uniqueProducersData, pagination: producersData.pagination };
        },
        enabled: Boolean(searchInput) && (category === "all" || category === "producers"),
      },
      {
        queryKey: ["peopleSearch", searchInput, category],
        queryFn: async () => {
          if (!searchInput) throw new Error("search term is null");
          const res = await jikanFetch(`https://api.jikan.moe/v4/people?q=${searchInput}&order_by=favorites&sort=desc`);
          if (!res.ok) throw new Error(res.statusText);
          const peopleData = await res.json();
          const uniquePeopleData = [...new Map(peopleData?.data.map((item) => [item.mal_id, item])).values()];
          return { data: uniquePeopleData, pagination: peopleData.pagination };
        },
        enabled: Boolean(searchInput) && (category === "all" || category === "people"),
      },
    ],
  });
  const queries = [animeSearchQ, mangaSearchQ, charactersSearchQ, producersSearchQ, peopleSearchQ];
  const isLoading = queries.some((q) => q.isLoading);
  const anyFetched = queries.some((q) => q.isFetched);

  // arrow navigation with enter selection
  useEffect(() => {
    if (!anyFetched) return;
    const searchResultsCont = document.getElementById("searchResults");
    if (!searchResultsCont) return;
    const searchResults = Array.from(searchResultsCont.querySelectorAll("a"));
    if (searchResults.length === 0) return;
    let index = 0;
    searchResults[index].classList.add("searchResult-hovered");
    function handleArrows(event) {
      switch (event.keyCode) {
        case 38: // Up arrow
          event.preventDefault();
          searchResults[index]?.classList.remove("searchResult-hovered");
          index = index > 0 ? --index : 0;
          searchResults[index]?.classList.add("searchResult-hovered");
          searchResults[index]?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          break;
        case 40: // Down arrow
          event.preventDefault();
          searchResults[index]?.classList.remove("searchResult-hovered");
          index = index < searchResults.length - 1 ? ++index : 0;
          searchResults[index]?.classList.add("searchResult-hovered");
          searchResults[index]?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          break;
        case 13: // Enter
          searchResults[index]?.click();
          break;
        default:
          break;
      }
    }
    const searchModal = searchResultsCont?.parentElement;
    searchModal.addEventListener("keydown", handleArrows);
    return () => {
      if (searchModal) searchModal.removeEventListener("keydown", handleArrows);
    };
  }, [anyFetched]);

  // add clicked item to localStorage then closeModal
  function handleClick(mal_id, image_url, name, link) {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (savedSearches.find((item) => item.mal_id === mal_id)) {
      closeModal();
      return;
    }
    const newSavedSearches = [{ mal_id, image_url, name, link }].concat(savedSearches).slice(0, 25);
    localStorage.setItem("recentSearches", JSON.stringify(newSavedSearches));
    closeModal();
  }
  // fetch recentSearches from localStorge then update the localState
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);
  return (
    <>
      {/* show recentSearches if no query is fetched */}
      {!anyFetched ? (
        <div id="recentSearches" className="flex flex-col">
          <div className="font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3">Recent</div>
          {recentSearches.length ? (
            <>
              {recentSearches.map((item, i) => (
                <Link
                  onClick={() => handleClick(item.mal_id, item.image_url, item.name, item.link)}
                  to={item.link}
                  key={`${item.mal_id}-${i}`}
                  className="w-full flex flex-row items-center justify-start gap-x-3 rounded-md px-4 py-2 lg:py-3 searchResult-hover durations-200"
                >
                  <img src={item.image_url || ""} alt={item.name} className="w-1/12 min-w-4 max-w-7 aspect-square rounded-full object-cover" />
                  <p>{item.name}</p>
                </Link>
              ))}
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {/* show search results */}
      <div id="searchResults" tabIndex={0} className="w-full grid grid-cols-1 max-h-full overflow-y-auto">
        {isLoading ? (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-1/2">Loading...</div>
          </>
        ) : (
          <>
            {animeSearchQ?.isEnabled ? (
              <>
                <div className="font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3">anime</div>
                {animeSearchQ?.data?.data?.map((item, i) =>
                  useSearchResult({ handleClick, mal_id: item.mal_id, image_url: item?.images?.jpg?.image_url, name: item?.title, link: `/anime/${item.mal_id}` }),
                )}
              </>
            ) : (
              ""
            )}
            {mangaSearchQ?.isEnabled ? (
              <>
                <div className="font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3">manga</div>
                {mangaSearchQ?.data?.data?.map((item, i) =>
                  useSearchResult({ handleClick, mal_id: item.mal_id, image_url: item?.images?.jpg?.image_url, name: item?.title, link: `/manga/${item.mal_id}` }),
                )}
              </>
            ) : (
              ""
            )}
            {charactersSearchQ?.isEnabled ? (
              <>
                <div className="font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3">characters</div>
                {charactersSearchQ?.data?.data?.map((item) =>
                  useSearchResult({ handleClick, mal_id: item.mal_id, image_url: item?.images?.jpg?.image_url, name: item?.name, link: `/character/${item.mal_id}` }),
                )}
              </>
            ) : (
              ""
            )}
            {producersSearchQ?.isEnabled ? (
              <>
                <div className="font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3">producers</div>
                {producersSearchQ?.data?.data?.map((item) =>
                  useSearchResult({ handleClick, mal_id: item.mal_id, image_url: item?.images?.jpg?.image_url, name: item?.titles[0]?.title, link: `/producer/${item.mal_id}` }),
                )}
              </>
            ) : (
              ""
            )}
            {peopleSearchQ?.isEnabled ? (
              <>
                <div className="font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3">people</div>
                {peopleSearchQ?.data?.data?.map((item) =>
                  useSearchResult({ handleClick, mal_id: item.mal_id, image_url: item?.images?.jpg?.image_url, name: item?.name, link: `/people/${item.mal_id}` }),
                )}
              </>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </>
  );
}

function useSearchResult({ handleClick, mal_id, image_url, name, link = "" }) {
  return (
    <Link
      onClick={() => handleClick(mal_id, image_url, name, link)}
      to={link}
      key={mal_id}
      className="w-full flex flex-row items-center justify-start gap-x-3 rounded-md px-4 py-2 lg:py-3 searchResult-hover durations-200"
    >
      <img src={image_url || ""} alt={name} className="w-1/12 min-w-4 max-w-7 aspect-square rounded-full object-cover" />
      <p>{name}</p>
    </Link>
  );
}
