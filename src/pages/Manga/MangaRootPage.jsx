import RootComponent from '../../components/RootComponent'
import UserItemModal from '../../components/userItemModal/UserItemModal'
import { useUserItemModal } from '../../components/userItemModal/useUserItemModal'
import data from '../../anilist/genresData.json'
import { type_status_map } from '../../utility/utils'

const filterData = {
  type: type_status_map.type.MANGA,
  status: Object.fromEntries(Object.entries(type_status_map.status.MANGA).map(([key,value])=>[value, key]))
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
