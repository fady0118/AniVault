import { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import Character from '../../components/CardBox/Box'
import CardBox from '../../components/CardBox/CardBox'
import { RootContext } from '../../App'
import {
  Bookmark,
  ChevronRight,
  Music4Icon,
  NotebookPen,
  SquareArrowOutUpRight,
  Star
} from 'lucide-react'
import {
  renderInfoStr,
  renderInfoArr,
  renderIcon,
  delay,
  dateFormatter,
  renderReactions,
  getYouTubeThumbnail
} from '../../utility/utils'
import { useRelations } from '../../utility/useRelations'
import useGallery from '../../utility/useGallery'
import Pictures from '../../components/character/Pictures'
import Gallery from '../../components/character/Gallery'
import { useQuery } from '@tanstack/react-query'
import Video from '../../components/anime/Video'
import { useVideoModal } from '../../utility/useVideoModal'
import VideoModal from '../../components/VideoModal'
import News from '../../components/anime/News'
import Reviews from '../../components/anime/Reviews'
import EpisodesModal from '../../components/anime/EpisodesModal'
import { jikanFetch } from '../../utility/jikanApi'
import { Link } from 'react-router'
import LoaderComponent from '../../components/LoaderComponent'
import { useUserItemModal } from '../../components/userItemModal/useUserItemModal'
import UserItemModal from '../../components/userItemModal/UserItemModal'
import { getAnimeDetailPage } from '../../anilist/pages/getAnimeDetailPage'

export default function AnimePage () {
  let { id } = useParams()
  const { windowWidth } = useContext(RootContext)
  const [showEpisodesModal, setShowEpisodesModal] = useState(false)
  const {
    setShowUserItemModal,
    showUserItemModal,
    setUserItemData,
    userItemData
  } = useUserItemModal()
  const [userItemModalTab, setUserItemModalTab] = useState(null)

  const animeQ = useQuery({
    queryKey: ['anime', id],
    queryFn: async () => {
      const res = await getAnimeDetailPage(id)
      return res || {}
    },
    throwOnError: false
  })

  const errorStatus = animeQ.error?.status
  const errorMessage =
    errorStatus === 404
      ? 'This anime item does not exist.'
      : animeQ.error?.message || 'Failed to load anime details.'

  // Gallery hook
  const { dispatch, showModal, openGallery, closeGallery, activeIndex } =
    useGallery(animeQ?.data?.pictures)
  // Relations hook
  const { relationsImgs, showAllRelations, setShowAllRelations } = useRelations(
    animeQ?.data
  )
  // Videos hook
  const { showVideoModal, videoRef, playVideo, closeVideo } = useVideoModal()

  function getAnimeStatus (status) {
    if (!status) return ''
    switch (status.toLowerCase().trim()) {
      case 'finished airing':
        return 'complete'
      case 'currently airing':
        return 'airing'
      case 'not yet aired':
        return 'upcoming'
    }
  }
  return (
    <>
      {animeQ.isPending ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : animeQ.isError ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <div className='p-4 text-center'>
            <p>{errorStatus} - {errorMessage}</p>
          </div>
        </div>
      ) : (
        <>
          <div className='relative z-10 w-full  flex justify-center min-h-screen pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark'>
            <div className='w-[95vw] flex flex-col space-y-3 '>
              <div className='flex flex-row items-end gap-x-2 order-1 mt-3 h-fit'>
                <div
                  id='title'
                  className='min-w-1/2 h-fit w-fit rounded-md px-3 py-1 box-colors flex flex-col'
                >
                  <div className='flex items-center gap-x-2.5 text-sm/relaxed sm:text-lg/relaxed font-bold'>
                    {animeQ?.data?.anime?.title.romaji}
                    <Link
                      className='min-w-6 w-7 sm:w-9 rounded-sm overflow-hidden'
                      to={animeQ?.data?.anime?.mal_url}
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
                    {animeQ?.data?.anime?.title.english ? (
                      <span>{animeQ?.data?.anime?.title.english}</span>
                    ) : (
                      ''
                    )}
                    {animeQ?.data?.anime?.title.native ? (
                      <span>{animeQ?.data?.anime?.title.native}</span>
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
                        setUserItemData(animeQ?.data?.anime)
                        setUserItemModalTab('lists')
                        setShowUserItemModal(true)
                      }}
                    />
                    <div
                      id='reviewModalBtn'
                      onClick={() => {
                        setUserItemData(animeQ?.data?.anime)
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
                              src={animeQ?.data?.anime?.images?.coverImage}
                              alt={animeQ?.data?.anime?.title.english}
                            />
                          </div>
                        </div>
                        <div className='order-last flex flex-col items-start flex-wrap gap-y-1 gap-x-1.5'>
                          <Bookmark
                            className='h-fit w-auto rounded-sm py-2.5 px-1 box-colors bookmark-colors'
                            onClick={() => {
                              setUserItemData(animeQ?.data?.anime)
                              setUserItemModalTab('lists')
                              setShowUserItemModal(true)
                            }}
                          />
                          <div
                            id='reviewModalBtn'
                            onClick={() => {
                              setUserItemData(animeQ?.data?.anime)
                              setUserItemModalTab('review')
                              setShowUserItemModal(true)
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
                            src={animeQ?.data?.anime?.images?.coverImage}
                            alt={animeQ?.data?.anime?.title.english}
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
                              {animeQ?.data?.anime?.score || '?'}
                            </p>
                          </div>

                          <div className='flex flex-col py-1 gap-y-1'>
                            <div className='grid grid-cols-[repeat(3,auto)] items-start gap-y-2 gap-x-2 lg:gap-x-6 capitalize'>
                              <div className='flex flex-col'>
                                <p className='text-[1.35em]'>Ranked</p>
                                <p className='text-[1.1em]'>
                                  #{animeQ?.data?.anime?.rank}
                                </p>
                              </div>
                              <div className='flex flex-col'>
                                <p className='text-[1.35em]'>Popularity</p>
                                <p className='text-[1.1em]'>
                                  #{animeQ?.data?.anime?.popularity}
                                </p>
                              </div>
                              <div className='flex flex-col'>
                                <p className='text-[1.35em]'>Members</p>
                                <p className='text-[1.1em]'>
                                  {animeQ?.data?.anime?.members?.toLocaleString()}
                                </p>
                              </div>
                              <Link
                                to={`/anime?type=${animeQ?.data?.anime?.type?.toLowerCase()}`}
                                className='text-[1.2em] blue-link duration-200'
                              >
                                {animeQ?.data?.anime?.type}
                              </Link>

                              <Link
                                to={`/anime/seasons/${animeQ?.data?.anime?.seasonYear}/${animeQ?.data?.anime?.season}`}
                                className='flex flex-row text-[1.2em] blue-link duration-200'
                              >
                                {animeQ?.data?.anime?.season}{' '}
                                {animeQ?.data?.anime?.seasonYear}
                              </Link>

                              <div className='flex flex-row space-x-1.5 flex-wrap text-[1.2em]'>
                                {animeQ?.data?.anime?.studios?.map(
                                  (studio, i) => (
                                    <Link
                                      key={i}
                                      to={`/producer/${studio.mal_id}`}
                                      className='blue-link duration-200'
                                    >
                                      {studio.name}
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='order-2 w-full flex flex-col md:flex-row gap-3'>
                  <div className='w-fit md:w-1/4 max-w-sm flex flex-col justify-between h-fit gap-y-2 md:gap-y-8 rounded-lg box-colors'>
                    <div id='information' className='w-full'>
                      <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                        information
                      </div>
                      <div className='px-3 py-2 text-xs font-light'>
                        <div className='grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]'>
                          {renderInfoStr(
                            'type',
                            `${animeQ?.data?.anime?.type}`,
                            `/anime?type=${animeQ?.data?.anime?.type?.toLowerCase()}`
                          )}
                          <div className='w-full flex flex-row  gap-x-2 items-center capitalize'>
                            <div className='flex flex-row gap-x-1'>
                              <p className='font-semibold '>episodes:</p>
                              <p>
                                {animeQ?.data?.anime?.episodes || 'unknown'}
                              </p>
                            </div>
                            {animeQ?.data?.anime?.episodes > 1 ? (
                              <div
                                onClick={() => {
                                  setShowEpisodesModal(true)
                                }}
                                className='flex flex-row flex-wrap items-center gap-x-1 blue-link hover:cursor-pointer'
                              >
                                <SquareArrowOutUpRight size={16} />
                                <span>Details</span>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                          {renderInfoStr(
                            'status',
                            `${animeQ?.data?.anime?.status}`,
                            `/anime?status=${getAnimeStatus(
                              animeQ?.data?.anime?.status
                            )}`
                          )}
                          {renderInfoStr(
                            'aired',
                            `${animeQ?.data?.anime?.aired?.string}`
                          )}
                          {animeQ?.data?.anime?.season ? (
                            <>
                              {renderInfoStr(
                                'premiered',
                                `${animeQ?.data?.anime?.season || ''} ${
                                  animeQ?.data?.anime?.seasonYear || ''
                                }`,
                                `/anime/seasons/${animeQ?.data?.anime?.seasonYear}/${animeQ?.data?.anime?.season}`
                              )}
                            </>
                          ) : (
                            ''
                          )}
                          {renderInfoStr(
                            'broadcast',
                            `${animeQ?.data?.anime?.broadcast?.string || ''}`
                          )}
                          {renderInfoArr(
                            'producers',
                            animeQ?.data?.anime?.producers,
                            '/producer/'
                          )}
                          {renderInfoArr(
                            'licensors',
                            animeQ?.data?.anime?.licensors
                          )}
                          {renderInfoArr(
                            'studios',
                            animeQ?.data?.anime?.studios,
                            '/producer/'
                          )}
                          {renderInfoStr(
                            'source',
                            `${animeQ?.data?.anime?.source}`
                          )}
                          {renderInfoArr(
                            'genres',
                            animeQ?.data?.anime?.genres,
                            '/anime?genres='
                          )}
                          {renderInfoArr(
                            'themes',
                            animeQ?.data?.anime?.themes,
                            '/anime?genres='
                          )}
                          {renderInfoArr(
                            'demographics',
                            animeQ?.data?.anime?.demographics
                          )}
                          {renderInfoStr(
                            'duration',
                            `${animeQ?.data?.anime?.duration}`
                          )}
                          {renderInfoStr(
                            'SFW',
                            `${!animeQ?.data?.anime?.isAdult}`
                          )}
                        </div>
                      </div>
                    </div>
                    <div id='statistics' className='w-full'>
                      <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                        statistics
                      </div>
                      <div className='px-3 py-2 text-xs font-light'>
                        <div className='grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]'>
                          {/* {renderInfoStr(
                            'score',
                            `${
                              animeQ?.data?.anime?.score
                            } (scored by ${animeQ?.data?.anime?.scored_by?.toLocaleString()} users) `
                          )} */}
                          {renderInfoStr(
                            'ranked',
                            `#${animeQ?.data?.anime?.rank}`
                          )}
                          {renderInfoStr(
                            'popularity',
                            `#${animeQ?.data?.anime?.popularity}`
                          )}
                          {renderInfoStr(
                            'members',
                            `${animeQ?.data?.anime?.members?.toLocaleString()}`
                          )}
                          {renderInfoStr(
                            'favorites',
                            `${(
                              animeQ?.data?.anime?.favourites ||
                              animeQ?.data?.anime?.favorites
                            )?.toLocaleString()}`
                          )}
                        </div>
                      </div>
                    </div>
                    <div id='external' className='w-full'>
                      <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                        Available At
                      </div>
                      <div className='px-3 py-2 text-xs font-light'>
                        <div className='grid grid-cols-1 w-full gap-y-2.5 lg:text-[1.1em]'>
                          {animeQ?.data?.anime?.externalLinks?.map((ext, i) => (
                            <p
                              key={i}
                              className='flex flex-row items-center gap-1.5'
                            >
                              {renderIcon(ext.site)}
                              <Link className='blue-link' to={ext.url}>
                                {ext.site}
                              </Link>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* {animeQ?.data?.anime?.streaming?.length ? (
                      <div id='streaming' className='w-ful'>
                        <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                          Streaming Platforms
                        </div>
                        <div className='flex flex-col gap-y-2.5 px-3 py-2 text-xs font-light'>
                          {animeQ?.data?.anime?.streaming.map((stream, i) => (
                            <div
                              key={i}
                              className='flex flex-row gap-x-2 items-center'
                            >
                              {renderIcon(stream.name)}
                              <Link className='blue-link' to={stream.url}>
                                {stream.name}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      ''
                    )} */}
                  </div>
                  <div className='w-full md:w-3/4 flex flex-col md:flex-row flex-wrap gap-3 h-fit'>
                    <div className='flex flex-col md:flex-row gap-3 w-full order-1'>
                      {animeQ?.data?.anime?.trailer?.youtube_id && (
                        <div
                          id='trailer'
                          className='rounded-lg box-colors overflow-hidden w-full h-fit md:w-1/2 order-2 md:order-1'
                        >
                          <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed'>
                            Watch Trailer
                          </div>
                          <div className='w-full aspect-video'>
                            <iframe
                              className='w-full h-full'
                              src={`https://www.youtube.com/embed/${animeQ?.data?.anime?.trailer?.youtube_id}`}
                              title='YouTube video player'
                              frameBorder='0'
                              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                              referrerPolicy='strict-origin-when-cross-origin'
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                      <div className='w-fit md:w-1/2 h-fit rounded-lg box-colors overflow-hidden order-1 md:order-2'>
                        <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                          titles
                        </div>
                        <div className='flex flex-col gap-y-1 px-3 py-2 text-xs font-light'>
                          {[
                            {
                              type: 'romaji',
                              title: animeQ?.data?.anime?.title?.romaji
                            },
                            {
                              type: 'english',
                              title: animeQ?.data?.anime?.title?.english
                            },
                            {
                              type: 'native',
                              title: animeQ?.data?.anime?.title?.native
                            }
                          ]
                            .filter(t => t.title)
                            .map((title, i) => (
                              <div
                                key={i}
                                className='flex flex-row space-x-1 w-full'
                              >
                                <p className='font-semibold min-w-16'>
                                  {title.type}:{' '}
                                </p>
                                <p>{title.title}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div
                      id='description'
                      className='rounded-lg box-colors h-fit w-full order-2'
                    >
                      <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                        description
                      </div>
                      <div className='flex flex-col space-y-1.5 px-3 py-2 items-end'>
                        <div className='peer'>
                          <input
                            className='hidden '
                            type='checkbox'
                            name='descriptionCheckbox'
                            id='descriptionCheckbox'
                          />
                        </div>
                        <p className='w-full text-xs font-light overflow-hidden max-lines-4 cutoff-text'>
                          {animeQ?.data?.anime?.description ||
                            'description missing..'}
                        </p>
                        {animeQ?.data?.anime?.description ? (
                          <label
                            htmlFor='descriptionCheckbox'
                            className="text-xs capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                          ></label>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div
                      id='Pictures'
                      className='box-colors rounded-md order-3'
                    >
                      <Pictures
                        pictures={animeQ?.data?.pictures}
                        openGallery={openGallery}
                        cols={2}
                      />
                    </div>

                    {animeQ?.data?.characters.dataArr.length ? (
                      <div
                        id='characters'
                        className='flex justify-center w-full h-fit order-4'
                      >
                        <div className='rounded-lg box-colors w-full '>
                          <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                            Characters & Voice Actors
                          </div>
                          <CardBox
                            dataArr={animeQ?.data?.characters.dataArr}
                            num={9}
                          />
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    <div
                      id='videos'
                      className='flex justify-center w-full h-fit order-4'
                    >
                      <div className='rounded-lg box-colors w-full '>
                        <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                          Videos
                        </div>
                        <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-2'>
                          {animeQ?.data.videos?.length ? (
                            <>
                              {animeQ?.data?.videos?.map((v, i) => (
                                <Video key={i} data={v} playVideo={playVideo} />
                              ))}
                            </>
                          ) : (
                            <p className='p-2 text-xs font-light'>
                              No videos found.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {animeQ?.data?.anime?.flattenedRelations?.length ? (
                      <div
                        id='relations'
                        className='flex justify-center w-full h-fit text-xs lg:text-sm order-5'
                      >
                        <div className='rounded-lg box-colors w-full '>
                          <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                            Related Entries
                          </div>

                          <div className='grid grid-cols-1 xs:grid-cols-2 auto-rows-fr gap-y-2 p-2'>
                            {animeQ?.data?.anime?.flattenedRelations
                              ?.slice(0, 3)
                              .map((entry, i) => (
                                <div key={i} className='flex flex-row w-full'>
                                  <Link
                                    className='w-1/4 max-w-20 h-full aspect-2/3 '
                                    to={`/${entry.type}/${entry.mal_id}`}
                                  >
                                    <img
                                      data-mal-id={entry.mal_id}
                                      className='w-full h-full object-cover text-[0.75em]'
                                      src={entry.images.jpg.image_url}
                                      alt={entry.name}
                                    />
                                  </Link>
                                  <div className='w-3/4 flex flex-col gap-y-1 px-2'>
                                    <Link
                                      to={`/${entry.type}/${entry.mal_id}`}
                                      className='blue-link'
                                    >
                                      {entry.title}
                                    </Link>
                                    <p className='text-[0.8em] capitalize'>
                                      {entry.relation.toLowerCase()} ({entry.type.toLowerCase()})
                                    </p>
                                  </div>
                                </div>
                              ))}
                            {!showAllRelations &&
                            animeQ?.data?.anime?.flattenedRelations?.length >
                              3 ? (
                              <div
                                onClick={() => {
                                  setShowAllRelations(true)
                                }}
                                className='flex flex-row justify-center items-center w-full text-2xl border-4 border-amethyst-smoke-400/30 hover:cursor-pointer hover:bg-amethyst-smoke-400/20'
                              >
                                +
                                {animeQ?.data?.anime?.flattenedRelations
                                  ?.length - 3}
                              </div>
                            ) : (
                              ''
                            )}
                            {showAllRelations
                              ? animeQ?.data?.anime?.flattenedRelations
                                  .slice(3)
                                  .map((entry, i) => (
                                    <div
                                      key={i + 3}
                                      className='flex flex-row w-full'
                                    >
                                      <Link
                                        className='w-1/4 max-w-20 h-full aspect-2/3 '
                                        to={`/${entry.type}/${entry.mal_id}`}
                                      >
                                        <img
                                          className='w-full h-full object-cover text-[0.75em]'
                                          data-mal-id={entry.mal_id}
                                          src={entry.images.jpg.image_url}
                                          alt={entry.name}
                                        />
                                      </Link>
                                      <div className='w-3/4 flex flex-col gap-y-1 px-2'>
                                        <Link
                                          to={`/${entry.type}/${entry.mal_id}`}
                                          className='blue-link'
                                        >
                                          {entry.title}
                                        </Link>
                                        <p className='text-[0.8em] capitalize'>
                                          {entry.relation.toLowerCase()} ({entry.type.toLowerCase()})
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

                    {animeQ?.data?.anime?.theme?.openings?.length ||
                    animeQ?.data?.anime?.theme?.endings?.length ? (
                      <div
                        id='theme'
                        className='flex justify-center w-full h-fit text-2xs lg:text-[11px] order-6'
                      >
                        <div className='rounded-lg box-colors w-full grid grid-cols-2 gap-4 py-1'>
                          {animeQ?.data?.anime?.theme?.openings?.length ? (
                            <div id='openings'>
                              <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                                openings
                              </div>
                              <div className='flex flex-col w-full gap-y-2 p-2'>
                                {animeQ?.data?.anime?.theme?.openings?.map(
                                  (opening, i) => (
                                    <div
                                      key={i}
                                      className='w-full flex flex-row items-center gap-x-2'
                                    >
                                      <Music4Icon
                                        className='w-[10%]'
                                        size={16}
                                      />
                                      <p className='w-[90%]'>{opening}</p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                          {animeQ?.data?.anime?.theme?.endings?.length ? (
                            <div id='endings'>
                              <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                                endings
                              </div>
                              <div className='flex flex-col w-full gap-y-2 p-2'>
                                {animeQ?.data?.anime?.theme?.endings?.map(
                                  (ending, i) => (
                                    <div
                                      key={i}
                                      className='w-full flex flex-row items-center gap-x-2'
                                    >
                                      <Music4Icon
                                        className='w-[10%]'
                                        size={16}
                                      />
                                      <p className='w-[90%]'>{ending}</p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                <Reviews
                  data={animeQ?.data?.reviews}
                  item_id={id}
                  mediaType='anime'
                />

                {animeQ?.data?.recommendations.recommendationsDataArr.length ? (
                  <div
                    id='recommendations'
                    className='order-4 rounded-lg box-colors w-full py-1'
                  >
                    <div className='bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                      recommendations
                    </div>
                    <CardBox
                      dataArr={
                        animeQ?.data?.recommendations.recommendationsDataArr
                      }
                      num={9}
                      aspect='2/3'
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div
              id='backgroundImage'
              className='-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden'
            >
              <img
                className='w-full h-full aspect-auto object-cover blur-lg scale-105 brightness-35 bg-repeat-y'
                src={animeQ?.data?.anime?.images?.coverImage}
                alt={animeQ?.data?.anime?.title.english}
              />
            </div>
          </div>
          {showVideoModal && videoRef.current && (
            <VideoModal closeModal={closeVideo} link={videoRef.current} />
          )}
          {showModal && (
            <Gallery
              name={
                animeQ?.data?.anime?.title?.english ||
                animeQ?.data?.anime?.title?.romaji
              }
              pictures={animeQ?.data?.pictures}
              activeIndex={activeIndex}
              closeGallery={closeGallery}
              onNext={() => dispatch({ type: 'next' })}
              onPrev={() => dispatch({ type: 'prev' })}
              onOpen={index => dispatch({ type: 'open', newIndex: index })}
            />
          )}
          {showEpisodesModal && (
            <EpisodesModal title={animeQ?.data?.anime.title.english} malId={animeQ?.data?.anime.mal_id} setShowEpisodesModal={setShowEpisodesModal} />
          )}
          {showUserItemModal && (
            <UserItemModal
              data={userItemData}
              setShowUserItemModal={setShowUserItemModal}
              userItemModalTab={userItemModalTab}
            />
          )}
        </>
      )}
    </>
  )
}
