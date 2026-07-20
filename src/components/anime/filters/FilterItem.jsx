import { Square, SquarePlus } from 'lucide-react'

export default function FilterItem ({ item, localState, handleChange }) {
  const filterKey = Object.keys(item)[0]
  const filterValue = Object.values(item)[0]
  return (
    <div
      id={filterKey}
      onClick={() => {
        handleChange(filterValue)
      }}
      className={`w-full flex flex-row items-center justify-between px-1 rounded-xs hover:cursor-pointer ${
        localState.split(',').includes(filterValue)
          ? 'bg-emerald-500/50 hover:bg-emerald-400/75'
          : 'hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75'
      }`}
    >
      <div className='flex flex-row items-center gap-x-0.5'>
        <>
          {localState.split(',').includes(filterValue) ? (
            <SquarePlus
              className='stroke-2 stroke-emerald-500 fill-amethyst-smoke-200'
              size={12}
            />
          ) : (
            <Square className='stroke-0 fill-amethyst-smoke-200' size={12} />
          )}
        </>
        <p className={`${filterKey.length > 3 ? 'capitalize' : 'uppercase'}`}>
          {filterKey}
        </p>
      </div>
    </div>
  )
}
