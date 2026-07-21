import { Circle, CircleCheckBig } from 'lucide-react'

export default function SortItem ({ item, localState, handleChange }) {
  const [key, value] = Object.entries(item)[0]
  return (
    <div
      id={key}
      onClick={() => {
        handleChange(value)
      }}
      className={`w-full flex flex-row items-center justify-between px-1 rounded-xs hover:cursor-pointer ${
        localState.order_by === value
          ? 'bg-emerald-500/50 hover:bg-emerald-400/75'
          : 'hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75'
      }`}
    >
      <div className='flex flex-row items-center gap-x-0.5'>
        <>
          {localState.order_by === value ? (
            <CircleCheckBig
              className='stroke-2 stroke-emerald-500 fill-amethyst-smoke-200'
              size={12}
            />
          ) : (
            <Circle className='stroke-0 fill-amethyst-smoke-200' size={12} />
          )}
        </>
        <p className='capitalize'>{key.split('_').join(' ')}</p>
      </div>
    </div>
  )
}
