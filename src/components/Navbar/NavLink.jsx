import { Link } from "react-router";

export default function NavLink({ classes, LinkTitle, data }) {
  return (
    <div className="group wrapperLink flex flex-row items-center">
      <Link to={`/${LinkTitle}`} className={classes.navListLinkText}>
        {LinkTitle}
        <div className="w-full h-0.5 absolute bottom-0 left-1/2 -translate-x-1/2 bg-pink-500/50 targetBar"></div>
      </Link>
      <div className="w-70 absolute top-[72%] right-0 box-colors-darker border border-dark-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10 rounded-md linkTarget">
        <div className="w-full h-full p-2 flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <Link
              to={`/${LinkTitle}?order_by=score&sort=desc`}
              className="w-full font-bold capitalize p-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 hover:text-pink-500/75 dark:hover:text-pink-400/75 duration-200"
            >
              top
            </Link>
            <Link
              to={`/${LinkTitle}?status=${LinkTitle === "anime" ? "airing" : "publishing"}&order_by=start_date&sort=desc`}
              className="w-full font-bold capitalize p-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 hover:text-pink-500/75 dark:hover:text-pink-400/75 duration-200"
            >
              recent
            </Link>
            <Link
              to={`/${LinkTitle}?status=upcoming&order_by=start_date&sort=desc`}
              className="w-full font-bold capitalize p-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 hover:text-pink-500/75 dark:hover:text-pink-400/75 duration-200"
            >
              upcoming
            </Link>
          </div>
          <div className="w-full font-bold capitalize p-1">
            <div className=" w-full font-bold capitalize py-1">Genres</div>
            <div className="w-full grid grid-cols-3 gap-1 py-1 text-[0.65em]">
              {data.map((item) => (
                <Link
                  key={item.mal_id}
                  to={`/${LinkTitle}?genres=${item?.mal_id}`}
                  className="w-full font-bold capitalize p-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 hover:text-pink-500/75 dark:hover:text-pink-400/75 duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
