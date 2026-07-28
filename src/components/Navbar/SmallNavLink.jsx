import { Link } from 'react-router'

export default function SmallNavLink ({ classes, LinkTitle, data }) {
  return (
    <label
      htmlFor={`small-navLink-${LinkTitle}`}
      className='group text-[0.9em]'
    >
      <input
        className='hidden'
        type='checkbox'
        name={`small-navLink-${LinkTitle}`}
        id={`small-navLink-${LinkTitle}`}
      />
      <p className={classes}>{LinkTitle}</p>

      <div className='hidden group-has-checked:block slide-in-from-top-half'>
        <div className='flex flex-row items-center justify-between px-5'>
          <Link
            to={`/${LinkTitle}?order_by=SCORE&sort=desc`}
            className='w-full font-bold capitalize py-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 dark:hover:text-indigo-400 hover:text-indigo-600 duration-200'
          >
            top
          </Link>
          <Link
            to={`/${LinkTitle}?status=RELEASING&order_by=POPULARITY&sort=desc`}
            className='w-full font-bold capitalize py-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 dark:hover:text-indigo-400 hover:text-indigo-600 duration-200'
          >
            recent
          </Link>
          <Link
            to={`/${LinkTitle}?status=NOT_YET_RELEASED&order_by=POPULARITY&sort=desc`}
            className='w-full font-bold capitalize py-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 dark:hover:text-indigo-400 hover:text-indigo-600 duration-200'
          >
            upcoming
          </Link>
        </div>
        <div className='grid grid-cols-1 3xs:grid-cols-2 2xs:grid-cols-3 px-5 py-2'>
          {data.map((item, i) => (
            <Link
              to={`/${LinkTitle}?genres=${item}&order_by=POPULARITY&sort=desc`}
              key={i}
              className='w-full text-[0.7em] font-bold capitalize py-1 rounded-sm hover:bg-amethyst-smoke-200/25 dark:hover:bg-dark-amethyst-smoke-300/25 dark:hover:text-indigo-400 hover:text-indigo-600 duration-200'
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </label>
  )
}
