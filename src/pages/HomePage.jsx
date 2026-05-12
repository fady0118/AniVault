import { useCallback, useEffect, useState } from "react";
import HomeSlider from "../components/home/HomeSlider";
import { getSeason } from "../utility/utils";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const seasonResults = useQuery({
    queryKey: ["seasonListData"],
    queryFn: () => fetch("https://api.jikan.moe/v4/seasons/now?filter=tv&limit=10?filter=tv&limit=10").then((res) => res.json()),
  });

  return (
    <div className="relative w-screen">
      {seasonResults.isPending ? <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div> : <HomeSlider season={seasonResults.data.data} />}
      {/* <div className="h-96"></div> */}
    </div>
  );
}
