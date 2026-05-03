import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function PeoplePage() {
  const { id } = useParams();
  const [personData, setPersonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchPerson() {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/people/${id}/full`);
        const data = await response.json();
        setPersonData(data.data ?? null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPerson();
  }, [id]);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-1/2">Loading...</div>
      ) : (
        <div className="relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 mt-15 text-dark-amethyst-smoke-50 dark:text-text-dark">
          <div className="w-1/4">
            <img className="w-full aspect-auto object-cover" src={personData.images.jpg.image_url} alt="" />
          </div>
        </div>
      )}
    </>
  );
}
