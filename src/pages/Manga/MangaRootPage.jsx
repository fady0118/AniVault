import RootComponent from "../../components/RootComponent";
import data from "../../utility/data.json"

const filterData = { type: ["manga", "novel", "lightnovel", "oneshot", "doujin", "manhwa", "manhua"], status: ["publishing", "complete", "hiatus", "discontinued", "upcoming"] };
const genresData = [...data.manga.genres, ...data.manga.themes];
const sortData = ["mal_id", "title", "start_date", "end_date", "chapters", "volumes", "score", "scored_by", "rank", "popularity", "members", "favorites"];

export default function MangaRootPage() {
  return (
    <>
      <RootComponent Root="manga" filterData={filterData} genresData={genresData} sortData={sortData} />
    </>
  );
}
