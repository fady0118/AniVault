import RootComponent from "../../components/RootComponent";
import { useUserItemModal } from "../../components/useUserItemModal";
import data from "../../utility/data.json";

const filterData = { type: ["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv_special"], status: ["airing", "complete", "upcoming"] };
const genresData = [...data.anime.genres, ...data.anime.themes];
const sortData = ["mal_id", "title", "start_date", "end_date", "episodes", "score", "scored_by", "rank", "popularity", "members", "favorites"];

export default function AnimeRootPage() {
  const { showUserItemModal, setShowUserItemModal, setUserItemData, userItemData, UserItemModal } = useUserItemModal();
  return (
    <>
      <RootComponent Root="anime" filterData={filterData} genresData={genresData} sortData={sortData} useritemModal={{setShowUserItemModal, setUserItemData}} />
      {showUserItemModal && <UserItemModal data={userItemData} setShowUserItemModal={setShowUserItemModal} />}
    </>
  );
}
