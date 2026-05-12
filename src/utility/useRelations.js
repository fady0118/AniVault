import { useEffect, useRef, useState } from "react";
import { delay } from "./utils";
import { useQueries } from "@tanstack/react-query";

// fetch single image
const getImage = async ({ mal_id, type }) => {
  const res = await fetch(`https://api.jikan.moe/v4/${type}/${mal_id}/full`);
  const { data } = await res.json();
  const image = data?.images.jpg.large_image_url;
  if (!image) throw new Error("No image returned");
  return {
    mal_id,
    image,
  };
};

export function useRelations(data) {
  const [showAllRelations, setShowAllRelations] = useState(false);

  const relations = data?.flattenedRelations ?? [];
  const visibleRelations = showAllRelations ? relations : relations.slice(0, 6);

  const relationsQ = useQueries({
    queries: visibleRelations.map((rel) => ({
      queryKey: ["relation", rel.mal_id, rel.type],
      queryFn: async () => {
        await delay(350);
        const image = await getImage(rel);
        return { ...rel, ...image };
      },
      enabled: !!data,
      retry: 10,
      retryDelay: 2000,
      staleTime: Infinity,
    })),
  });
  const relationsImgs = relationsQ?.filter((q) => q.status === "success").map((r) => r.data);

  return { relationsImgs, showAllRelations, setShowAllRelations };
}
