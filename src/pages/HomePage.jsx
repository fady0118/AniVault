import { useCallback, useEffect, useState } from "react";
import HomeSlider from "../components/home/HomeSlider";
import { getSeason } from "../utility/utils";

export default function HomePage() {
  const [season, setSeason] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      const date = new Date();
      const response = await fetch(`https://api.jikan.moe/v4/seasons/${date.getFullYear()}/${getSeason(date)}?filter=tv&limit=10`);
      const data = await response.json();
      setSeason(data.data ?? []);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return <div className="relative w-screen">{isLoading ? <div>Loading...</div> : <HomeSlider season={season} />}</div>;
}
