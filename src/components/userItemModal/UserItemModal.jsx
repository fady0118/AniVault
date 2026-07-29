// UserItemModal.jsx
import { useEffect, useState } from 'react'
import { tablesDB } from '../../appwrite'
import { useAuth } from '../../Contexts/AuthContext'
import { queryAniList } from '../../anilist/client'
import { USER_ITEM_MODAL_QUERY } from '../../anilist/queries/userItemModalQuery'
import UserItemStatusComponent from './UserItemStatusComponent'
import UserItemListsComponent from './UserItemListsComponent'
import UserItemReviewModal from './UserItemReviewModal'
import LoaderComponent from '../LoaderComponent'
import { Query } from 'appwrite'

function normalizeModalData (data) {
  if (!data) return null

  const aniListId = Number(data.aniList_id ?? data.id) || null
  const title =
    data?.title?.english ||
    data?.title?.romaji ||
    data?.title?.native ||
    'Unknown'

  const coverImage = data.images?.coverImage || {}
  const coverImageUrl =
    coverImage?.extraLarge ||
    coverImage?.large ||
    coverImage?.medium ||
    'https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg'

  return {
    ...data,
    id: aniListId,
    aniList_id: aniListId,
    title,
    // title_full: title,
    type: data.type?.toLowerCase() ?? null,
    status: data.status ?? null,
    episodes: data.episodes ?? null,
    volumes: data.volumes ?? null,
    chapters: data.chapters ?? null,
    coverImage,
    coverImageUrl,
    bannerImage:
      data.bannerImage || coverImage.extraLarge || coverImageUrl || ''
  }
}

export default function UserItemModal ({
  data = undefined,
  setShowUserItemModal,
  userItemTableData = undefined,
  setUserItems = undefined,
  refetchReviews = undefined,
  userItemModalTab = undefined
}) {
  const { loggedInUser } = useAuth()
  const [userItemData, setUserItemData] = useState(null)
  const [aniListData, setAniListData] = useState(() =>
    normalizeModalData(data ?? null)
  )

  const [mediaType, setMediaType] = useState(
    () => userItemTableData?.mediaType ?? aniListData?.type ?? null
  )
  const [currentTab, setCurrentTab] = useState('status')

  const [aniListStatus, setAniListStatus] = useState(
    aniListData ? 'ready' : 'loading'
  )

  useEffect(() => {
    if (data) {
      setAniListData(normalizeModalData(data))
      setAniListStatus('ready')
      return
    }

    const id = userItemTableData?.aniList_id
    if (!id) {
      setAniListStatus('error')
      return
    }

    let active = true
    setAniListStatus('loading')
    ;(async () => {
      try {
        const aniListResult = await queryAniList(USER_ITEM_MODAL_QUERY, {
          id: Number(id)
        })
        if (!active) return
        const normalized = normalizeModalData(aniListResult?.Media ?? null)
        setAniListData(normalized)
        setAniListStatus(normalized ? 'ready' : 'error')
      } catch (error) {
        console.error('Failed to load AniList data:', error)
        if (!active) return
        setAniListStatus('error')
      }
    })()
    return () => {
      active = false
    }
  }, [data, userItemTableData?.aniList_id])

  useEffect(() => {
    let active = true
    async function fetchUserItemFromDb () {
      if (userItemTableData) {
        setUserItemData(userItemTableData)
        return
      }
      const aniListId = aniListData?.aniList_id
      if (!loggedInUser?.$id || !aniListId) return
      try {
        const res = await tablesDB.listRows({
          databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_USER_ITEM,
          queries: [
            Query.equal('user_id', loggedInUser.$id),
            Query.equal('aniList_id', Number(aniListId)),
            Query.limit(1)
          ]
        })
        if (!active) return
        const existingItem = res?.rows?.[0] ?? null
        if (existingItem?.mediaType) {
          setMediaType(existingItem.mediaType)
        }
        setUserItemData(existingItem)
      } catch (error) {
        console.error('Failed to fetch user item:', error)
      }
    }
    fetchUserItemFromDb()
    return () => {
      active = false
    }
  }, [userItemTableData, aniListData?.aniList_id, loggedInUser?.$id])

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setShowUserItemModal(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setShowUserItemModal])

  return (
    <div className='z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg'>
      <div className='fixed top-1/2 left-1/2 -translate-1/2 h-fit w-[90%] sm:w-4/5 md:w-3/5 xl:w-1/2 rounded-xl p-3 xs:p-4 max-h-[90vh] overflow-y-auto box-colors'>
        <button
          onClick={() => setShowUserItemModal(false)}
          className='btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent'
          aria-label='Close authentication modal'
        >
          ✕
        </button>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row justify-between items-center gap-2'>
            <div
              role='tablist'
              className='tabs tabs-border w-full justify-start'
            >
              <button
                onClick={() => setCurrentTab('status')}
                role='tab'
                className={`tab ${
                  currentTab === 'status'
                    ? 'tab-active text-indigo-500'
                    : 'text-text-light/50 dark:text-text-dark/50'
                }`}
              >
                Status
              </button>
              {(!userItemModalTab || userItemModalTab === 'lists') && (
                <button
                  onClick={() => setCurrentTab('lists')}
                  role='tab'
                  className={`tab ${
                    currentTab === 'lists'
                      ? 'tab-active text-indigo-500'
                      : 'text-text-light/50 dark:text-text-dark/50'
                  }`}
                >
                  Lists
                </button>
              )}
              {(!userItemModalTab || userItemModalTab === 'review') && (
                <button
                  onClick={() => setCurrentTab('review')}
                  role='tab'
                  className={`tab ${
                    currentTab === 'review'
                      ? 'tab-active text-indigo-500'
                      : 'text-text-light/50 dark:text-text-dark/50'
                  }`}
                >
                  Review
                </button>
              )}
            </div>
          </div>

          {aniListStatus === 'loading' && (
            <section className='rounded-2xl border border-white/10 section-colors-medium p-8 shadow-inner shadow-slate-900/30 flex justify-center'>
              <div className='relative scale-75'>
                <LoaderComponent />
              </div>
            </section>
          )}

          {aniListStatus === 'error' && (
            <section className='rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30'>
              <p className='text-sm text-rose-600 dark:text-rose-400'>
                Couldn't load this title from AniList. Please close this and try
                again.
              </p>
            </section>
          )}

          {aniListStatus === 'ready' && (
            <>
              {currentTab === 'status' && (
                <UserItemStatusComponent
                  aniListData={aniListData}
                  mediaType={mediaType}
                  setMediaType={setMediaType}
                  setUserItems={setUserItems}
                  userItemData={userItemData}
                  setUserItemData={setUserItemData}
                />
              )}

              {currentTab === 'lists' && (
                <UserItemListsComponent
                  aniListData={aniListData}
                  mediaType={mediaType}
                  userItemTableData={userItemTableData}
                />
              )}

              {currentTab === 'review' && (
                <UserItemReviewModal
                  aniListData={aniListData}
                  mediaType={mediaType}
                  userItemData={userItemData}
                  refetchReviews={refetchReviews}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
