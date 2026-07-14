import RootComponent from "../../components/RootComponent";
import UserItemModal from "../../components/userItemModal/UserItemModal";
import { useUserItemModal } from "../../components/userItemModal/useUserItemModal";
import data from "../../utility/data.json"

const filterData = { type: ["manga", "novel", "lightnovel", "oneshot", "doujin", "manhwa", "manhua"], status: ["publishing", "complete", "hiatus", "discontinued", "upcoming"] };
const genresData = [...data.manga.genres, ...data.manga.themes];
const sortData = ["mal_id", "title", "start_date", "end_date", "chapters", "volumes", "score", "scored_by", "rank", "popularity", "members", "favorites"];

export default function MangaRootPage() {
   const { showUserItemModal, setShowUserItemModal, setUserItemData, userItemData } = useUserItemModal();
  return (
    <>
      <RootComponent Root="manga" filterData={filterData} genresData={genresData} sortData={sortData} setUserItemModalStates={{setShowUserItemModal, setUserItemData}}  />
      {showUserItemModal && <UserItemModal data={userItemData} setShowUserItemModal={setShowUserItemModal} />}
    </>
  );
}
