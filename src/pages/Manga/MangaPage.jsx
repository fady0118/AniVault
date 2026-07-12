import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { RootContext } from '../../App'
import {
  renderInfoStr,
  renderInfoArr,
  renderIcon,
  DateTimeFormatter,
  renderReactions,
  dateFormatter
} from '../../utility/utils'
import useGallery from '../../utility/useGallery'
import Gallery from '../../components/character/Gallery'
import Pictures from '../../components/character/Pictures'
import CardBox from '../../components/CardBox/CardBox'
import { useRelations } from '../../utility/useRelations'
import { useQueries } from '@tanstack/react-query'
import { Bookmark, ChevronRight, NotebookPen, Star } from 'lucide-react'
import News from '../../components/anime/News'
import Reviews from '../../components/anime/Reviews'
import { jikanFetch } from '../../utility/jikanApi'
import LoaderComponent from '../../components/LoaderComponent'
import { useUserItemModal } from '../../components/userItemModal/useUserItemModal'
import UserItemModal from '../../components/userItemModal/UserItemModal'

export default function MangaPage () {
  let { id } = useParams()
  const { windowWidth } = useContext(RootContext)
  const {
    setShowUserItemModal,
    showUserItemModal,
    setUserItemData,
    userItemData
  } = useUserItemModal()
  const [userItemModalTab, setUserItemModalTab] = useState(null)

  const [mangaQ, charactersQ, reviewsQ, picturesQ, recommendationsQ, newsQ] =
    useQueries({
      queries: [
        {
          queryKey: ['manga', id],
          queryFn: async () => {
            const res = await jikanFetch(
              `https://api.jikan.moe/v4/manga/${id}/full`
            )
            if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`)
            const manga_Data = await res.json()
            return {
              ...manga_Data.data,
              flattenedRelations: manga_Data.data?.relations.flatMap(
                ({ relation, entry }) =>
                  entry.map(item => ({ ...item, relation }))
              )
            }
          }
        },
        {
          queryKey: ['characters', id],
          queryFn: async () => {
            const res = await jikanFetch(
              `https://api.jikan.moe/v4/manga/${id}/characters`
            )
            const characters_Data = await res.json()
            const charactersDataArr = characters_Data?.data?.map(
              ({ role, character }) => ({
                character: { path: 'character', role, ...character }
              })
            )
            return {
              characters: [characters_Data.data],
              dataArr: charactersDataArr
            }
          }
        },
        {
          queryKey: ['reviews', id],
          queryFn: async () => {
            const res = await jikanFetch(
              `https://api.jikan.moe/v4/manga/${id}/reviews`
            )
            const reviews_Data = await res.json()
            const allReviews = reviews_Data?.data ?? []
            const featured = [
              allReviews?.find(r =>
                r.tags.some(tag => tag.toLowerCase() === 'recommended')
              ),
              allReviews?.find(r =>
                r.tags.some(tag => tag.toLowerCase() === 'mixed feelings')
              ),
              allReviews?.find(r =>
                r.tags.some(tag => tag.toLowerCase() === 'not recommended')
              )
            ].filter(Boolean)
            const rest = allReviews?.filter(
              r => !featured.map(f => f.mal_id).includes(r.mal_id)
            )
            return {
              ...reviews_Data,
              featured,
              rest,
              stats: {
                all: allReviews.length,
                recommended: allReviews.reduce(
                  (c, r) =>
                    r.tags.some(t => t.toLowerCase() == 'recommended')
                      ? c + 1
                      : c,
                  0
                ),
                mixedFeelings: allReviews.reduce(
                  (c, r) =>
                    r.tags.some(t => t.toLowerCase() == 'mixed feelings')
                      ? c + 1
                      : c,
                  0
                ),
                notRecommended: allReviews.reduce(
                  (c, r) =>
                    r.tags.some(t => t.toLowerCase() == 'not recommended')
                      ? c + 1
                      : c,
                  0
                ),
                avgScore:
                  allReviews.reduce((c, r) => c + r.score, 0) /
                  reviews_Data.data?.length
              }
            }
          }
        },
        {
          queryKey: ['pictures', id],
          queryFn: async () => {
            const res = await jikanFetch(
              `https://api.jikan.moe/v4/manga/${id}/pictures`
            )
            const pictures_Data = await res.json()
            return pictures_Data.data ?? []
          }
        },
        {
          queryKey: ['recommendations', id],
          queryFn: async () => {
            const res = await jikanFetch(
              `https://api.jikan.moe/v4/manga/${id}/recommendations`
            )
            const recommendations_Data = await res.json()
            // recommendationsDataArr data array
            const recommendationsDataArr =
              recommendations_Data?.data?.map(recommendation => ({
                anime: {
                  path: 'anime',
                  ...recommendation.entry,
                  name: recommendation.entry.title,
                  votes: recommendation.votes
                }
              })) || []
            return {
              recommendations: recommendations_Data.data || [],
              recommendationsDataArr
            }
          }
        },
        {
          queryKey: ['news', id],
          queryFn: async () => {
            const res = await jikanFetch(
              `https://api.jikan.moe/v4/manga/${id}/news`
            )
            const news_Data = await res.json()
            return news_Data.data ?? []
          }
        }
      ]
    })

  // Gallery section
  const { dispatch, showModal, openGallery, closeGallery, activeIndex } =
    useGallery(picturesQ?.data ?? [])

  // Relations section
  const { relationsImgs, showAllRelations, setShowAllRelations } = useRelations(
    mangaQ.data
  )

  function getMangaStatus (status) {
    if (!status) return ''
    switch (status.toLowerCase().trim()) {
      case 'publishing':
        return 'publishing'
      case 'finished':
        return 'complete'
      case 'on hiatus':
        return 'hiatus'
      case 'discontinued':
        return 'discontinued'
      default:
        return 'upcoming'
    }
  }
  return (
    <>
      {mangaQ.isLoading ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : (
        <div className='relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark'>
          <div className='w-[95vw] flex flex-col space-y-3'>
            <div className='flex flex-row items-center gap-x-2 order-1 mt-3'>
              <div
                id='title'
                className='min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex flex-col'
              >
                <div className='flex items-center gap-x-2.5 text-sm/relaxed sm:text-lg/relaxed font-bold'>
                  {mangaQ?.data?.title}
                  <Link
                    className='min-w-6 w-7 sm:w-9 rounded-sm overflow-hidden'
                    to={mangaQ?.data?.url}
                    target='_blank'
                  >
                    <img
                      src='https:upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png'
                      alt='MyAnimeList Logo'
                      className='w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300'
                    />
                  </Link>
                </div>
                <div className='flex items-center space-x-2.5 text-xs/snug sm:text-md/snug font-normal dark:text-text-dark/65'>
                  {mangaQ?.data?.title_english ? (
                    <span>{mangaQ?.data.title_english}</span>
                  ) : (
                    ''
                  )}
                  {mangaQ?.data?.title_japanese ? (
                    <span>{mangaQ?.data.title_japanese}</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {windowWidth > 480 ? (
                <div className='flex flex-row items-end flex-wrap gap-y-1 gap-x-1.5'>
                  <Bookmark
                    className='h-fit w-auto rounded-sm py-2.5 px-1 box-colors bookmark-colors'
                    onClick={() => {
                      setUserItemData(mangaQ?.data)
                      setUserItemModalTab('lists')
                      setShowUserItemModal(true)
                    }}
                  />
                  <div
                    id='reviewModalBtn'
                    onClick={() => {
                      setUserItemData(mangaQ?.data)
                      setUserItemModalTab('review')
                      setShowUserItemModal(true)
                    }}
                    className='flex items-center gap-x-1 text-xs sm:text-sm rounded-sm p-1 box-colors bookmark-colors'
                  >
                    <NotebookPen size={14} />
                    <p>write a review</p>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className='order-2 flex flex-col w-full gap-y-3'>
              <div className='w-full order-1 flex flex-col gap-3'>
                <div className='flex flex-col xs:flex-row items-stretch gap-3 w-full'>
                  {windowWidth <= 480 ? (
                    <div className='w-full flex flex-row items-start gap-2 xs:w-fit xs:inline-block'>
                      <div className='w-1/6 min-w-28 2xs:min-w-36 aspect-2/3 rounded-lg box-colors order-1 overflow-hidden self-auto shrink-0'>
                        <div id='poster' className='w-full h-full'>
                          <img
                            className='h-full w-full object-cover rounded-lg overflow-hidden'
                            src={mangaQ?.data?.images?.jpg?.large_image_url}
                            alt={mangaQ?.data?.title}
                          />
                        </div>
                      </div>
                      <div className='order-last flex flex-col items-start flex-wrap gap-y-1 gap-x-1.5'>
                        <Bookmark
                          className='h-fit w-auto rounded-sm py-2.5 px-1 box-colors bookmark-colors'
                          onClick={() => {
                            setUserItemData(mangaQ?.data)
                            setShowUserItemModal(true)
                          }}
                        />
                        <div
                          id='reviewModalBtn'
                          onClick={() => {
                            setShowReviewsModal(true)
                          }}
                          className='flex items-center gap-x-1 text-xs sm:text-sm rounded-sm p-1 box-colors bookmark-colors'
                        >
                          <NotebookPen size={14} />
                          <p>write a review</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='w-1/6 min-w-28 2xs:min-w-36 aspect-2/3 rounded-lg box-colors order-1 overflow-hidden self-auto shrink-0'>
                      <div id='poster' className='w-full h-full'>
                        <img
                          className='h-full w-full object-cover rounded-lg overflow-hidden'
                          src={mangaQ?.data?.images?.jpg?.large_image_url}
                          alt={mangaQ?.data?.title}
                        />
                      </div>
                    </div>
                  )}
                  <div className='order-1 flex flex-col gap-3'>
                    <div id='details' className='box-colors rounded-lg w-fit'>
                      <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                        Details
                      </div>
                      <div className='p-2 flex flex-row flex-wrap gap-2 text-3xs sm:text-2xs'>
                        <div className='flex flex-col justify-evenly pr-2 items-center border-r border-amethyst-smoke-500/20 '>
                          <p className='text-text-dark text-[1.1em] font-medium px-2.5 bg-mal-blue rounded-xs uppercase'>
                            Score
                          </p>
                          <p className='text-[1.35em]/snug font-semibold'>
                            {mangaQ?.data?.score || 'N/A'}
                          </p>
                          <p className='font-light'>
                            {mangaQ?.data?.scored_by?.toLocaleString() || '-'}{' '}
                            users
                          </p>
                        </div>

                        <div className='flex flex-col py-1 gap-y-1'>
                          <div className='grid grid-cols-[repeat(3,auto)] items-start gap-y-2 gap-x-2 lg:gap-x-6 capitalize '>
                            <div className='flex flex-col w-fit'>
                              <p className='text-[1.35em]'>Ranked</p>
                              <p className='text-[1.1em]'>
                                # {mangaQ?.data?.rank || '?'}
                              </p>
                            </div>
                            <div className='flex flex-col w-fit'>
                              <p className='text-[1.35em]'>Popularity</p>
                              <p className='text-[1.1em]'>
                                # {mangaQ?.data?.popularity || '?'}
                              </p>
                            </div>
                            <div className='flex flex-col w-fit'>
                              <p className='text-[1.35em]'>Members</p>
                              <p className='text-[1.1em]'>
                                {mangaQ?.data?.members?.toLocaleString()}
                              </p>
                            </div>

                            <Link
                              to={`/manga?type=${mangaQ?.data?.type.toLowerCase()}`}
                              className='text-[1.2em] blue-link duration-200 w-fit'
                            >
                              {mangaQ?.data?.type}
                            </Link>
                            <div className='flex flex-row flex-wrap gap-x-0.5 items-center text-[1.2em] w-fit'>
                              {mangaQ?.data?.serializations?.map((s, i) => (
                                <Link
                                  key={i}
                                  className='blue-link'
                                  to={`/manga/magazine/${s.mal_id}`}
                                >
                                  {s.name}
                                </Link>
                              ))}
                            </div>
                            <div className='flex flex-row flex-wrap items-center text-[1.2em] w-fit'>
                              {mangaQ?.data?.authors?.map((s, i, arr) => (
                                <p key={i}>
                                  <Link
                                    className='blue-link'
                                    to={`/${s.type}/${s.mal_id}`}
                                  >
                                    {s.name}
                                  </Link>
                                  <span className='mr-1.5'>
                                    {i < arr.length - 1 ? ',' : ''}
                                  </span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {windowWidth > 480 ? (
                      <div className='w-full rounded-lg box-colors order-2 overflow-hidden'>
                        <div id='background' className='pt-0.5'>
                          <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                            background
                          </div>
                          <div className='flex flex-col px-3 py-2'>
                            <div className='peer'>
                              <input
                                type='checkbox'
                                name='background-text-checkbox'
                                id='background-text-checkbox'
                                className='hidden'
                              />
                            </div>
                            <p className='text-xs font-light max-lines-3 cutoff-text min-h-8'>
                              {mangaQ?.data?.background ||
                                'No background found.'}
                            </p>
                            {mangaQ?.data?.background ? (
                              <div className='w-full flex flex-row justify-end text-xs capitalize'>
                                <label
                                  htmlFor='background-text-checkbox'
                                  className=" hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300 before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                ></label>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                {windowWidth <= 480 ? (
                  <div className='w-full rounded-lg box-colors order-2 overflow-hidden'>
                    <div id='background'>
                      <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                        background
                      </div>
                      <div className='flex flex-col px-3 py-2'>
                        <div className='peer'>
                          <input
                            type='checkbox'
                            name='background-text-checkbox'
                            id='background-text-checkbox'
                            className='hidden'
                          />
                        </div>
                        <p className='text-xs font-light max-lines-4 cutoff-text min-h-8'>
                          {mangaQ?.data?.background || 'No background found.'}
                        </p>
                        {mangaQ?.data?.background ? (
                          <div className='w-full flex flex-row justify-end text-xs capitalize'>
                            <label
                              htmlFor='background-text-checkbox'
                              className=" hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300 before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                            ></label>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className='order-2 w-full flex flex-col sm:flex-row gap-3'>
                <div className='w-fit sm:w-1/3 md:w-1/4 max-w-sm flex flex-col justify-between h-fit gap-y-2 md:gap-y-8 rounded-lg box-colors'>
                  <div id='information' className='w-full pt-0.5'>
                    <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                      information
                    </div>
                    <div className='px-3 py-2 text-xs font-light'>
                      <div className='grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]'>
                        {renderInfoStr(
                          'type',
                          `${mangaQ?.data?.type}`,
                          `/manga?type=${mangaQ?.data?.type}`
                        )}
                        {renderInfoStr(
                          'volumes',
                          `${mangaQ?.data?.volumes ?? '?'}`
                        )}
                        {renderInfoStr(
                          'chapters',
                          `${mangaQ?.data?.chapters ?? '?'}`
                        )}
                        {renderInfoStr(
                          'status',
                          `${mangaQ?.data?.status}`,
                          `/manga?status=${getMangaStatus(
                            mangaQ?.data?.status
                          )}`
                        )}
                        {renderInfoStr(
                          'published',
                          `${mangaQ?.data?.published?.string}`
                        )}
                        {renderInfoArr(
                          'genres',
                          mangaQ?.data?.genres,
                          '/manga?genres='
                        )}
                        {renderInfoArr(
                          'themes',
                          mangaQ?.data?.themes,
                          '/manga?genres='
                        )}
                        {renderInfoArr(
                          'demographics',
                          mangaQ?.data?.demographics
                        )}
                        {renderInfoArr(
                          'serializations',
                          mangaQ?.data?.serializations,
                          '/manga/magazine/'
                        )}
                        {renderInfoArr(
                          'authors',
                          mangaQ?.data?.authors,
                          '/people/'
                        )}
                      </div>
                    </div>
                  </div>
                  <div id='statistics' className='w-full pt-0.5 '>
                    <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                      statistics
                    </div>
                    <div className='px-3 py-2 text-xs font-light'>
                      <div className='grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]'>
                        {renderInfoStr(
                          'score',
                          `${
                            mangaQ?.data?.score
                          } (scored by ${mangaQ?.data?.scored_by?.toLocaleString()} users) `
                        )}
                        {renderInfoStr('ranked', `#${mangaQ?.data?.rank}`)}
                        {renderInfoStr(
                          'popularity',
                          `#${mangaQ?.data?.popularity}`
                        )}
                        {renderInfoStr(
                          'members',
                          `${mangaQ?.data?.members?.toLocaleString()}`
                        )}
                        {renderInfoStr(
                          'favorites',
                          `${mangaQ?.data?.favorites?.toLocaleString()}`
                        )}
                      </div>
                    </div>
                  </div>
                  {mangaQ?.data?.external?.length ? (
                    <div id='external' className='w-full'>
                      <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                        Available At
                      </div>
                      <div className='px-3 py-2 text-xs font-light'>
                        <div className='grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]'>
                          {mangaQ?.data?.external?.map((ext, i) => (
                            <p
                              className='flex flex-row items-center gap-1.5'
                              key={i}
                            >
                              {renderIcon(ext.name)}
                              <Link
                                target='_blank'
                                className='blue-link'
                                to={ext.url}
                              >
                                {ext.name}
                              </Link>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                <div className='w-full sm:w-2/3 md:w-3/4 flex flex-col gap-y-2 pt-0.5 '>
                  <div
                    id='titles'
                    className='w-full h-fit rounded-lg box-colors overflow-hidden order-1'
                  >
                    <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                      titles
                    </div>
                    <div className='flex flex-col gap-y-1 px-3 py-2 text-xs font-light'>
                      {mangaQ?.data?.titles?.length
                        ? mangaQ?.data?.titles.map((title, i) => (
                            <div
                              key={i}
                              className='flex flex-row space-x-1 w-full'
                            >
                              <p className='font-semibold min-w-16'>
                                {title.type}:{' '}
                              </p>
                              <p>{title.title}</p>
                            </div>
                          ))
                        : ''}
                    </div>
                  </div>

                  <div
                    id='synopsis'
                    className='rounded-lg box-colors h-fit w-full order-2 pt-0.5'
                  >
                    <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                      synopsis
                    </div>
                    <div className='flex flex-col space-y-1.5 px-3 py-2 items-end'>
                      <div className='peer'>
                        <input
                          className='hidden '
                          type='checkbox'
                          name='synopsisCheckbox'
                          id='synopsisCheckbox'
                        />
                      </div>
                      <p className='w-full text-xs font-light overflow-hidden max-lines-4 cutoff-text'>
                        {mangaQ?.data?.synopsis || 'synopsis missing..'}
                      </p>
                      {mangaQ?.data?.synopsis ? (
                        <label
                          htmlFor='synopsisCheckbox'
                          className="text-xs capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                              before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                        ></label>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  <div id='Pictures' className='box-colors rounded-md order-3'>
                    <Pictures
                      pictures={picturesQ?.data}
                      openGallery={openGallery}
                      cols={2}
                    />
                  </div>

                  {charactersQ?.data?.dataArr?.length ? (
                    <div
                      id='characters'
                      className='flex justify-center w-full h-fit order-4'
                    >
                      <div className='rounded-lg box-colors w-full '>
                        <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                          Characters
                        </div>
                        <CardBox dataArr={charactersQ.data.dataArr} num={7} />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}

                  {mangaQ?.data?.flattenedRelations?.length ? (
                    <div
                      id='relations'
                      className='flex justify-center w-full h-fit text-2xs lg:text-xs order-5'
                    >
                      <div className='rounded-lg box-colors w-full '>
                        <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                          Related Entries
                        </div>

                        <div className='grid grid-cols-1 xs:grid-cols-2 auto-rows-fr gap-y-2 p-2'>
                          {mangaQ?.data?.flattenedRelations
                            .slice(0, 3)
                            .map((entry, i) => (
                              <div key={i} className='flex flex-row w-full'>
                                <Link
                                  className='w-1/4 max-w-14 h-full aspect-2/3 '
                                  to={`/${entry.type}/${entry.mal_id}`}
                                >
                                  <img
                                    data-mal-id={entry.mal_id}
                                    className='w-full h-full object-cover'
                                    src={
                                      relationsImgs?.find(
                                        r => r.mal_id === entry.mal_id
                                      )?.image ?? null
                                    }
                                    alt={entry.name}
                                  />
                                </Link>
                                <div className='w-3/4 flex flex-col gap-y-1 px-2'>
                                  <Link
                                    to={`/${entry.type}/${entry.mal_id}`}
                                    className='blue-link'
                                  >
                                    {entry.name}
                                  </Link>
                                  <p>
                                    {entry.relation} ({entry.type})
                                  </p>
                                </div>
                              </div>
                            ))}
                          {!showAllRelations &&
                          mangaQ?.data?.flattenedRelations?.length > 3 ? (
                            <div
                              onClick={() => {
                                setShowAllRelations(true)
                              }}
                              className='flex flex-row justify-center items-center w-full text-2xl border-4 border-amethyst-smoke-400/30 hover:cursor-pointer hover:bg-amethyst-smoke-400/20'
                            >
                              +{mangaQ?.data?.flattenedRelations.length - 3}
                            </div>
                          ) : (
                            ''
                          )}
                          {showAllRelations
                            ? mangaQ?.data?.flattenedRelations
                                .slice(3)
                                .map((entry, i) => (
                                  <div
                                    key={i + 3}
                                    className='flex flex-row w-full'
                                  >
                                    <Link
                                      className='w-1/4 max-w-14 h-full aspect-2/3 '
                                      to={`/${entry.type}/${entry.mal_id}`}
                                    >
                                      <img
                                        className='w-full h-full object-cover'
                                        data-mal-id={entry.mal_id}
                                        src={
                                          relationsImgs?.find(
                                            r => r.mal_id === entry.mal_id
                                          )?.image ?? null
                                        }
                                        alt={entry.name}
                                      />
                                    </Link>
                                    <div className='w-3/4 flex flex-col gap-y-1 px-2'>
                                      <Link
                                        to={`/${entry.type}/${entry.mal_id}`}
                                        className='blue-link'
                                      >
                                        {entry.name}
                                      </Link>
                                      <p>
                                        {entry.relation} ({entry.type})
                                      </p>
                                    </div>
                                  </div>
                                ))
                            : ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              <Reviews data={reviewsQ?.data} item_id={id} mediaType='manga' />

              {recommendationsQ?.data?.recommendations?.length ? (
                <div
                  id='recommendations'
                  className='order-4 rounded-lg box-colors w-full py-1'
                >
                  <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                    recommendations
                  </div>
                  <CardBox
                    dataArr={recommendationsQ?.data?.recommendationsDataArr}
                    num={9}
                    aspect='2/3'
                  />
                </div>
              ) : (
                ''
              )}
              <News data={newsQ.data} />
            </div>

            <div
              id='backgroundImage'
              className='-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden'
            >
              <img
                className='w-full h-full aspect-auto object-cover blur-lg scale-105 brightness-35 bg-repeat-y'
                src={mangaQ?.data?.images?.jpg?.large_image_url}
                alt={mangaQ?.data?.title}
              />
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <Gallery
          name={mangaQ?.name}
          pictures={picturesQ?.data}
          activeIndex={activeIndex}
          closeGallery={closeGallery}
          onNext={() => dispatch({ type: 'next' })}
          onPrev={() => dispatch({ type: 'prev' })}
          onOpen={index => dispatch({ type: 'open', newIndex: index })}
        />
      )}
      {showUserItemModal && (
        <UserItemModal
          data={userItemData}
          setShowUserItemModal={setShowUserItemModal}
          userItemModalTab={userItemModalTab}
        />
      )}
    </>
  )
}
