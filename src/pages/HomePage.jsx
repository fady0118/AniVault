import { useCallback, useEffect, useState } from "react";
import HomeSlider from "../components/home/HomeSlider";

//https://api.jikan.moe/v4/schedules?filter=sunday
export default function HomePage() {
  const [schedual, setSchedual] = useState([]);
  useEffect(() => {
    const date = new Date();
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    async function fetchData() {
      const response = await fetch(`https://api.jikan.moe/v4/schedules?filter=${dayName}`);
      const data = await response.json();
      setSchedual(data.data?? []);
    }
    fetchData();
  }, []);

  return <div className="w-screen">{schedual.length && <HomeSlider schedual={schedual} />}</div>;
}
