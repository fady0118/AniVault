import { Play } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { domPurifyParseMarkDown } from '../../utility/utils'

const gradientStyles = `bg-[linear-gradient(0deg,#e7e6ee_20%,#e7e6eea8_50%,transparent_65%)] dark:bg-[linear-gradient(0deg,#1b1e1f_20%,#1b1e1fab_50%,transparent_65%)] sm:bg-[linear-gradient(90deg,#e7e6ee_25%,#e7e6eea8_60%,transparent_100%)] sm:dark:bg-[linear-gradient(90deg,#1b1e1f_25%,#1b1e1fab_60%,transparent_100%)]`

export default function Slide ({ animeData, index, openModal }) {
  const title =
    animeData.title?.english ||
    animeData.title?.romaji ||
    animeData.title?.native

  const slideDescription_html = useMemo(() => {
    if (!animeData?.description) return
    return domPurifyParseMarkDown(animeData.description)
  }, [animeData?.description])
  return (
    <>
      <div
        className={`relative slide w-full h-full flex justify-end items-center shrink-0 text-6xl overflow-hidden `}
      >
        <div className='w-full h-full absolute top-0 left-0 '></div>
        <div
          className={`absolute z-20 top-0 left-0 w-full h-full ${gradientStyles}`}
        >
          <div className='w-full sm:w-[65%] h-full flex flex-col justify-end items-start'>
            <div className='w-full sm:w-4/5 md:w-2/3 box-border h-1/2 sm:h-2/3 flex flex-col space-y-3 sm:space-y-6 justify-center px-9'>
              <div className='w-full text-xl sm:text-4xl font-extrabold'>
                {title}
              </div>

              <div className='flex items-center space-x-2 text-xs'>
                {animeData.status && (
                  <div id='status' className='flex space-x-1.5'>
                    <div className='px-1 py-0.5 text-2xs font-semibold rounded-sm border border-rose-600 text-rose-600 dark:border-emerald-600 dark:text-emerald-600'>
                      {animeData.status}
                    </div>
                  </div>
                )}

                <div id='type' className='flex space-x-1.5'>
                  <div className='font-extrabold'>{animeData.format}</div>
                </div>

                <div id='genres' className='flex'>
                  {animeData.genres?.join(', ')}
                </div>

                <Link
                  className='w-6 sm:w-8 rounded-sm overflow-hidden flex items-center'
                  to={`https://anilist.co/anime/${animeData.id}`}
                  target='_blank'
                >
                  <img
                    src='https://upload.wikimedia.org/wikipedia/commons/6/61/AniList_logo.svg'
                    alt='AniList Logo'
                    className='w-full aspect-square object-cover object-center hover:brightness-125 duration-300'
                  />
                </Link>
              </div>

              {animeData?.description && (
                <div
                  id='synopsis'
                  className='flex text-xs font-light max-h-1/6 line-clamp-4'
                  dangerouslySetInnerHTML={{ __html: slideDescription_html }}
                />
              )}

              <div className='w-1/2 sm:w-3/4 lg:w-1/2 min-w-48 flex justify-center py-1.5 rounded-lg bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-200'>
                <div className='flex justify-between text-2xs sm:text-xs w-[90%] px-5'>
                  <div className='flex-col space-y-0.5'>
                    <div className='font-extralight'>Score</div>
                    <div className='font-bold text-xs xs:text-md'>
                      {animeData.averageScore
                        ? `${animeData.averageScore}%`
                        : 'N/A'}
                    </div>
                  </div>
                  <div className='flex-col space-y-0.5'>
                    <div className='font-extralight'>Popularity</div>
                    <div className='font-bold text-xs xs:text-md'>
                      {animeData.popularity
                        ? `#${animeData.popularity.toLocaleString()}`
                        : 'N/A'}
                    </div>
                  </div>
                  <div className='flex-col space-y-0.5'>
                    <div className='font-extralight'>Year</div>
                    <div className='font-bold text-xs xs:text-md'>
                      {animeData.seasonYear || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div
                id='links'
                className='flex flex-col 2xs:flex-row justify-center items-start 2xs:justify-start 2xs:items-center w-full space-x-5 space-y-3 2xs:space-y-0'
              >
                <Link
                  to={`/anime/${animeData.id}`}
                  className='flex justify-center items-center w-3/5 2xs:w-2/5 aspect-9/2 rounded-lg uppercase text-xs 2xs:text-sm font-semibold text-text-dark bg-mal-blue hover:cursor-pointer hover:brightness-125 hover:-translate-y-1 duration-300'
                >
                  More Details
                </Link>

                <button
                  onClick={() => {
                    if (animeData.trailer?.site === 'youtube') {
                      openModal(
                        `https://www.youtube.com/embed/${animeData.trailer.id}`
                      )
                    }
                  }}
                  disabled={!animeData.trailer}
                  className={`flex justify-center items-center space-x-2 w-3/5 2xs:w-2/5 aspect-9/2 rounded-lg uppercase text-xs 2xs:text-sm font-semibold border border-rose-600 text-rose-600 dark:border-emerald-600 dark:text-emerald-600 hover:cursor-pointer hover:brightness-125 hover:-translate-y-1 duration-300 ${
                    !animeData.trailer
                      ? 'opacity-50 hover:translate-y-0 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <Play size={18} />
                  <span>Trailer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <img
          className={`img min-h-screen w-full sm:w-3/4 aspect-auto object-center object-cover pointer-events-none ${
            index === 0 ? 'animate-slide' : ''
          }`}
          src={
            animeData.coverImage?.extraLarge ||
            animeData.coverImage?.large ||
            animeData.bannerImage
          }
          alt={title}
        />
      </div>
    </>
  )
}
