import RootComponent from '../../components/RootComponent'
import UserItemModal from '../../components/userItemModal/UserItemModal'
import { useUserItemModal } from '../../components/userItemModal/useUserItemModal'
import genresData from '../../anilist/genresData.json'

const filterData = {
  type: {
    TV: 'TV',
    'TV short': 'TV_SHORT',
    Movie: 'MOVIE',
    Special: 'SPECIAL',
    OVA: 'OVA',
    ONA: 'ONA',
    Music: 'MUSIC'
  },
  status: {
    'Finished airing': 'FINISHED',
    'Currently airing': 'RELEASING',
    'Not yet aired': 'NOT_YET_RELEASED',
    'Cancelled': 'CANCELLED',
    'On hiatus': 'HIATUS'
  }
}
export const getDisplayLabel = (localStateValue, category = 'type') => {
  const entries = Object.entries(filterData[category]);
  const found = entries.find(([_, val]) => val === localStateValue);
  return found ? found[0] : localStateValue; // fallback to the value itself
};

const sortData = [
  'mal_id',
  'title',
  'start_date',
  'end_date',
  'episodes',
  'score',
  'scored_by',
  'rank',
  'popularity',
  'members',
  'favorites'
]

export default function AnimeRootPage () {
  const {
    showUserItemModal,
    setShowUserItemModal,
    setUserItemData,
    userItemData
  } = useUserItemModal()
  return (
    <>
      <RootComponent
        Root='anime'
        filterData={filterData}
        genresData={genresData}
        sortData={sortData}
        setUserItemModalStates={{ setShowUserItemModal, setUserItemData }}
      />
      {showUserItemModal && (
        <UserItemModal
          data={userItemData}
          setShowUserItemModal={setShowUserItemModal}
        />
      )}
    </>
  )
}
