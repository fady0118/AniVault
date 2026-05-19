import { Baby, Star } from "lucide-react";
import { useEffect } from "react";

export default function AnimePopup({ mouseLeave, ref }) {
  return (
    <>
      <div ref={ref} onMouseLeave={mouseLeave} id="info" className="z-50 absolute hidden w-64 h-fit rounded-lg bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-200">
        <div className="w-full h-full p-3 flex flex-col gap-y-2 text-xs text-dark-amethyst-smoke-400 dark:text-amethyst-smoke-400">
          <div id="titles" className="flex flex-col gap-y-1 grow-0 items-start justify-center pb-1 capitalize">
            <p className="font-bold text-[1.2em]">title</p>
            <p className="text-[0.9em]">title_japanese</p>
          </div>
          <div className="text-[0.7em] flex flex-row flex-wrap gap-x-1.5 justify-start items-center">
            <div id="rating" className="flex flex-row gap-x-1 items-center px-2 py-1 rounded-xl border magazine-border-colors">
              <Baby size={10} />
              <p>rating</p>
            </div>
            <div id="score" className="flex flex-row gap-x-1 items-center px-2 py-1 rounded-xl border magazine-border-colors">
              <Star size={10} />
              <p>score</p>
            </div>
          </div>
          <div id="synopsis">
            <p className="max-lines-4 cutoff-text-abs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores quod officia dignissimos earum est illo provident quidem reiciendis hic veniam, autem veritatis ducimus molestiae
              corporis aliquid temporibus voluptatem sint magnam.
            </p>
          </div>
          <div className="flex flex-col gap-y-0.5">
            <div id="aired" className="flex flex-row gap-x-1 items-center">
              <p className="font-light">Aired:</p>
              <p className="font-medium">{new Date().toLocaleDateString("en-US")}</p>
            </div>
            <div id="status" className="flex flex-row gap-x-1 items-center">
              <p className="font-light">status:</p>
              <p className="font-medium">airing</p>
            </div>
            <div id="genres" className="flex flex-row gap-x-1 items-center">
              <p className="font-light">genres:</p>
              <div className="flex flex-row items-start flex-wrap gap-x-1.5"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
