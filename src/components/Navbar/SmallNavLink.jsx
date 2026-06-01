import { Link } from "react-router";

export default function SmallNavLink({ classes, LinkTitle, data }) {
  return (
    <label htmlFor={`small-navLink-${LinkTitle}`} className="group text-[0.9em]">
      <input className="hidden" type="checkbox" name={`small-navLink-${LinkTitle}`} id={`small-navLink-${LinkTitle}`} />
      <p className={classes}>{LinkTitle}</p>
      <div className="hidden group-has-checked:grid grid-cols-1 3xs:grid-cols-2 2xs:grid-cols-3 px-5 py-2">
        {data.map((item) => (
          <Link to={`/${LinkTitle}?genres=${item.mal_id}`} key={item.mal_id} className="w-full text-[0.7em] font-bold capitalize py-1 rounded-sm hover:bg-amethyst-smoke-100/25 dark:hover:bg-dark-amethyst-smoke-300/25 dark:hover:text-indigo-400 hover:text-indigo-600 duration-200">
            {item.name}
          </Link>
        ))}
      </div>
    </label>
  );
}
