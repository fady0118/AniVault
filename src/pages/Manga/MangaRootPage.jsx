import RootComponent from '../../components/RootComponent'
import UserItemModal from '../../components/userItemModal/UserItemModal'
import { useUserItemModal } from '../../components/userItemModal/useUserItemModal'
import data from '../../anilist/genresData.json'

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

export default function MangaRootPage () {
  const {
    showUserItemModal,
    setShowUserItemModal,
    setUserItemData,
    userItemData
  } = useUserItemModal()
  const genresData = data.genresData
  const sortData = data.sortData
  return (
    <>
      <RootComponent
        Root='manga'
        filterData={filterData}
        genresData={genresData}
        sortData={sortData.manga}
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
