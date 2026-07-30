import RootComponent from '../../components/RootComponent'
import UserItemModal from '../../components/userItemModal/UserItemModal'
import { useUserItemModal } from '../../components/userItemModal/useUserItemModal'
import data from '../../anilist/genresData.json'
import { type_status_map } from '../../utility/utils'

const filterData = {
  type: type_status_map.type.ANIME,
  status: Object.fromEntries(Object.entries(type_status_map.status.ANIME).map(([key,value])=>[value, key]))
}
export const getDisplayLabel = (localStateValue, category = 'type') => {
  const entries = Object.entries(filterData[category])
  const found = entries.find(([_, val]) => val === localStateValue)
  return found ? found[0] : localStateValue // fallback to the value itself
}


export default function AnimeRootPage () {
  const {
    showUserItemModal,
    setShowUserItemModal,
    setUserItemData,
    userItemData
  } = useUserItemModal()
  const genresData = data.genresData;
  const sortData = data.sortData;
  return (
    <>
      <RootComponent
        Root='anime'
        filterData={filterData}
        genresData={genresData}
        sortData={sortData.anime}
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
