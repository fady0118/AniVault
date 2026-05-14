import React from "react";

export default function Test() {
  return (
    <>
      <div key={manga.mal_id} className="w-full flex flex-col capitalize rounded-md theme-bg-colors">
        <div className="flex flex-col grow-0 items-center justify-center text-center py-1.5">
          <a href={`/${manga.type || "manga"}/${manga.mal_id}`} className="font-bold text-[1.25em] blue-link hover:cursor-pointer">
            {manga.title_english || manga.title}
          </a>
          <p className="text-[0.9em] font-light">{manga.title_japanese}</p>
        </div>
        <div className="flex flex-row flex-wrap justify-center w-full items-center capitalize py-1.5 border-b border-dark-amethyst-smoke-50/25 dark:border-amethyst-smoke-200/25">
          <div className="flex flex-row flex-wrap gap-x-1.5 justify-center items-center w-1/3 border-r border-dark-amethyst-smoke-50/25 dark:border-amethyst-smoke-200/25">
            <Calendar size={13} />
            <p>{getSeason(manga.published.from)},</p>
            <p>{getYear(manga.published.from)}</p>
          </div>

          <div className="flex flex-row gap-x-1.5 justify-center items-center w-1/3  border-r border-dark-amethyst-smoke-50/25 dark:border-amethyst-smoke-200/25">
            <div className={`w-1.5 aspect-square rounded-full ${manga.publishing ? "bg-green-500" : "bg-dark-amethyst-smoke-50/75 dark:bg-amethyst-smoke-200/75"}`}></div>
            <p className={`${manga.publishing ? "text-green-500" : ""}`}>{manga.publishing ? "publishing" : "finished"}</p>
          </div>
          <div className="flex flex-row gap-x-1.5 justify-center items-center w-1/3">
            <BookOpen size={13} />
            <span>
              {manga.volumes ?? "?"} vols · {manga.chapters ?? "?"} chs
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center py-1.5">
          {manga.genres.slice(0, 4).map((genre, i) => (
            <a key={i} href={genre.url} className="hover-blue-link duration-150">
              {genre.name}
            </a>
          ))}
        </div>
        <div className="w-full flex flex-row items-start grow px-1.5">
          <div id="poster" className="w-1/2 md:w-2/5">
            <a href={`/${manga.type || "manga"}/${manga.mal_id}`}>
              <img className="w-full h-full aspect-auto object-cover" src={`${manga.images.jpg.image_url}`} alt={manga.title_english || manga.title} />
            </a>
          </div>
          <div className="w-1/2 md:w-3/5 flex flex-col gap-y-2 pl-2 pt-2">
            <div className="w-full flex flex-col order-1 gap-y-0.5">
              <div className="flex flex-row flex-wrap gap-x-1.5">
                <p className="font-semibold">Authors</p>
                <div className="flex flex-row flex-wrap gap-x-0 5">
                  {manga.authors.map((author, i, arr) => (
                    <p key={i}>
                      <a className="blue-link" href={`/${author.type}/${author.mal_id}`}>
                        {author.name}
                      </a>
                      <span className="mr-1.5">{i < arr.length - 1 ? "," : ""}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex flex-row items-center flex-wrap gap-x-1.5">
                <p className="font-semibold">Themes</p>
                <div className="flex flex-row flex-wrap gap-x-1">
                  {manga.themes.length
                    ? manga.themes.map((theme, i) => (
                        <a
                          href={theme.url}
                          key={i}
                          className="font-light rounded-full px-1.5 py-0.5 border border-dark-amethyst-smoke-50/25 dark:border-amethyst-smoke-200/25 hover-blue-link hover:cursor-pointer duration-200"
                        >
                          {theme.name}
                        </a>
                      ))
                    : "-"}
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-x-1.5">
                <p className="font-semibold">demographics</p>
                <div className="flex flex-row flex-wrap gap-x-1">
                  {manga.demographics.length
                    ? manga.demographics.map((demographic, i) => (
                        <p key={i} className="font-light">
                          {demographic.name}
                        </p>
                      ))
                    : "-"}
                </div>
              </div>
            </div>
            <div className="overflow-y-scroll grow w-full max-h-25 order-2">
              <div className="flex flex-col gap-y-1.5 items-end">
                <div className="peer">
                  <input className="hidden" type="checkbox" name={`synopsisCheckbox-${manga.mal_id}`} id={`synopsisCheckbox-${manga.mal_id}`} />
                </div>
                <p className="w-full h-full text-xs font-light max-lines-4 cutoff-text">{manga.synopsis || "synopsis missing.."}</p>
                {manga.synopsis ? (
                  <label
                    htmlFor={`synopsisCheckbox-${manga.mal_id}`}
                    className="text-xs capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                  ></label>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center py-1.5 capitalize border-t border-dark-amethyst-smoke-50/25 dark:border-amethyst-smoke-200/25">
          <div className="flex flex-row gap-x-1 w-1/3 justify-center items-center border-r border-dark-amethyst-smoke-50/25 dark:border-amethyst-smoke-200/25">
            <Star size={14} />
            <p>{manga.score || "?"}</p>
          </div>
          <div className="flex flex-row gap-x-1 w-1/3 justify-center items-center border-r border-dark-amethyst-smoke-50/25 dark:border-amethyst-smoke-200/25">
            <User size={14} />
            <p>{manga.members.toLocaleString() || "?"}</p>
          </div>
          <div className="flex flex-row gap-x-1 w-1/3 justify-center items-center">
            <Hash size={14} />
            <p>{manga.rank.toLocaleString() || "?"}</p>
          </div>
        </div>
      </div>

      <div key={manga.mal_id} className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
        {/* Top: poster + info */}
        <div className="flex flex-row min-h-0">
          {/* Poster */}
          <a href={`/${manga.type || "manga"}/${manga.mal_id}`} className="shrink-0 w-22 block bg-neutral-100 dark:bg-neutral-800">
            <img src={manga.images.jpg.image_url} alt={manga.title_english || manga.title} className="w-full h-full object-cover min-h-[130px]" />
          </a>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-1.5 p-3 min-w-0">
            {/* Titles */}
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <a href={`/${manga.type || "manga"}/${manga.mal_id}`} className="text-[15px] font-medium text-blue-600 dark:text-blue-400 hover:underline leading-snug truncate">
                {manga.title_english || manga.title}
              </a>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-normal whitespace-nowrap">{manga.title_japanese}</span>
            </div>

            {/* Synopsis */}
            <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3 m-0">{manga.synopsis || "Synopsis missing…"}</p>

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mt-0.5">
              {manga.genres.slice(0, 4).map((genre, i) => (
                <a
                  key={i}
                  href={genre.url}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150"
                >
                  {genre.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom meta strip */}
        <div className="flex flex-wrap items-center border-t border-neutral-200 dark:border-neutral-800">
          {/* Status */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 border-r border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${manga.publishing ? "bg-green-500" : "bg-neutral-400"}`} />
            <span className={`text-[11.5px] font-medium ${manga.publishing ? "text-green-500" : "text-neutral-400"}`}>{manga.publishing ? "Publishing" : "Finished"}</span>
          </div>

          {/* Season + year */}
          <div className="flex items-center gap-1 px-3.5 py-1.5 border-r border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <Calendar size={13} className="text-neutral-400" />
            <span className="text-[11.5px] text-neutral-500">
              {getSeason(manga.published.from)}, {getYear(manga.published.from)}
            </span>
          </div>

          {/* Volumes + chapters */}
          <div className="flex items-center gap-1 px-3.5 py-1.5 border-r border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <BookOpen size={13} className="text-neutral-400" />
            <span className="text-[11.5px] text-neutral-500">
              {manga.volumes ?? "?"} vols · {manga.chapters ?? "?"} chs
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3.5 px-3.5 py-1.5 ml-auto flex-shrink-0">
            <div className="flex items-center gap-1">
              <Star size={13} className="text-neutral-400" />
              <span className="text-[11.5px] font-medium text-neutral-800 dark:text-neutral-200">{manga.score}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={13} className="text-neutral-400" />
              <span className="text-[11.5px] text-neutral-500">{manga.members.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Hash size={13} className="text-neutral-400" />
              <span className="text-[11.5px] text-neutral-500">{manga.rank.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
