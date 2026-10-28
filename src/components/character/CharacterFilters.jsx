import { useCharacter } from './useCharacter'
import KeywordFilter from '../../components/anime/filters/KeywordFilter'
import { ChevronLeft } from 'lucide-react'
const classes = {
  chevron: 'p-0.5 rounded-md box-content duration-200 scale-80 md:scale-100'
}
export default function CharacterFilters () {
  const {
    collectorStore,
    handleApplyFilter,
    currentPage,
    navigateToPage,
    pageSwap,
    paginationInfo
  } = useCharacter()
  return (
    <div className='order-2 relative px-3 py-1 mb-2 space-y-2 text-[1em]'>
      {/* Filter bar — always visible, independent of load/error/empty state */}
      <div
        id='header'
        className='z-30 relative w-full flex flex-wrap flex-row items-center justify-start gap-2 md:gap-3 capitalize font-medium text-[0.8em] md:text-[0.9em]'
      >
        <KeywordFilter
          registerCollector={fn => (collectorStore.current.keyword = fn)}
          resetPage={true}
        />
        <div
          id='filterBtn'
          className='header-box box-colors-stronger hover:cursor-pointer'
          onClick={handleApplyFilter}
        >
          <p className='px-2'>filter</p>
        </div>
      </div>
      {/* Pagination Controls */}
      <div className='w-fit flex flex-row items-center gap-x-1 py-1 px-2 text-[0.9em] box-colors-stronger rounded-lg'>
        {currentPage > 1 && (
          <p
            className='px-2 py-0.5 rounded-md hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20 duration-200'
            onClick={() => navigateToPage(1)}
          >
            1
          </p>
        )}

        <div className='flex flex-row items-center gap-x-2'>
          <ChevronLeft
            onClick={() => pageSwap('prev')}
            size={20}
            className={`${classes.chevron} ${
              currentPage > 1
                ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                : 'stroke-text-light/25 dark:stroke-text-dark/25'
            }`}
          />

          <p className='px-2 py-0.5 font-medium select-none'>
            Page {currentPage}
          </p>

          <ChevronLeft
            onClick={() => pageSwap('next')}
            size={20}
            className={`rotate-180 ${classes.chevron} ${
              paginationInfo?.has_next_page
                ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                : 'stroke-text-light/25 dark:stroke-text-dark/25'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
