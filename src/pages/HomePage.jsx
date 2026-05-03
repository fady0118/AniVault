import { useCallback, useEffect, useState } from "react";
import HomeSlider from "../components/home/HomeSlider";
import { getSeason } from "../utility/utils";

export default function HomePage() {
  const [seasonList, setSeasonList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/seasons/now?filter=tv&limit=10?filter=tv&limit=10`);
        const data = await response.json();
        setSeasonList(data.data ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="relative w-screen">
      {isLoading ? <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div> : <HomeSlider season={seasonList} />}
      {/* <div className="h-96"></div> */}
    </div>
  );
}
