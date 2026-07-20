import RootComponent from '../../components/RootComponent'
import UserItemModal from '../../components/userItemModal/UserItemModal'
import { useUserItemModal } from '../../components/userItemModal/useUserItemModal'
import genresData from '../../anilist/genresData.json'

const filterData = {
  type: {
    Manga: 'MANGA',
    Novel: 'NOVEL',
    'One Shot': 'ONE_SHOT'
  },
  status: {
    'Finished publishing': 'FINISHED',
    'Currently publishing': 'RELEASING',
    'Not yet published': 'NOT_YET_RELEASED',
    Cancelled: 'CANCELLED',
    'On hiatus': 'HIATUS'
  }
}

const sortData = [
  'mal_id',
  'title',
  'start_date',
  'end_date',
  'chapters',
  'volumes',
  'score',
  'scored_by',
  'rank',
  'popularity',
  'members',
  'favorites'
]

export default function MangaRootPage () {
  const {
    showUserItemModal,
    setShowUserItemModal,
    setUserItemData,
    userItemData
  } = useUserItemModal()
  return (
    <>
      <RootComponent
        Root='manga'
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
