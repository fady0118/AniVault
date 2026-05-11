import { useRef, useState } from "react";
import { delay } from "./utils";

export function useRelations(data) {
  const [relationsImgs, setRelationsImgs] = useState([]);
  const [showAllRelations, setShowAllRelations] = useState(false);
  const timesFetchedRef = useRef(0);
  const dataRef = useRef(data);

  // fetch single image
  const getImage = async ({ mal_id, type }) => {
    const res = await fetch(`https://api.jikan.moe/v4/${type}/${mal_id}/full`);
    const { data } = await res.json();
    return {
      mal_id,
      image: data?.images.jpg.large_image_url,
    };
  };

  // fetch relation-images for a slice of flattenedRelations-array and inject into relationsImgs state
  async function fetchRelations(startIndex, lastIndex) {
    for (const entry of data?.flattenedRelations.slice(startIndex, lastIndex)) {
      await delay(50);
      const image = await getImage(entry);
      setRelationsImgs((s) => [...s, { ...entry, ...image }]);
    }
  }

  // fetch relation-image for a single relation and inject into relationsImgs state
  async function fetchSingleRelation(rel) {
    await delay(350); // delay for the api rate limit (3req/sec)
    const image = await getImage(rel);
    setRelationsImgs((s) => {
      s = s.filter((r) => r.mal_id !== rel.mal_id);
      return [...s, { ...rel, ...image }];
    });
  }

  // a check for relation-entries with a null image and call the fetchSingleRelation() function
  async function checkRelatedEntriesImgs() {
    await delay(50);
    const entries = Array.from(document.querySelectorAll("#relations>div>div.grid>div>a>img")).map((e) => ({ src: e.getAttribute("src"), mal_id: Number(e.dataset.malId) }));
    entries.forEach(async (entry) => {
      if (!entry.src) {
        const rel = dataRef.current?.flattenedRelations?.find((r) => Number(r.mal_id) === entry.mal_id);
        if (rel) {
          await fetchSingleRelation(rel);
        }
      }
    });
  }

  return { relationsImgs, showAllRelations, setShowAllRelations, dataRef, getImage, fetchRelations, fetchSingleRelation, checkRelatedEntriesImgs, timesFetchedRef };
}
