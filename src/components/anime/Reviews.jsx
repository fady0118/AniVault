import { ChevronRight, Star } from "lucide-react";
import { dateFormatter, renderReactions } from "../../utility/utils";

export default function Reviews({ data }) {
  return (
    <>
      {data?.featured.length ? (
        <div id="reviews" className="order-3 rounded-lg box-colors w-full py-1">
          <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">reviews</div>
          <div className="flex flex-col w-full text-2xs/normal sm:text-xs/normal gap-y-2 py-2 px-3">
            <div className="flex flex-row flex-wrap gap-y-1 justify-between bottom-border pb-2">
              <div className="flex flex-row items-center gap-x-1 py-1 px-3 bg-amethyst-smoke-700/30 text-2xs">
                <p>Avg Score</p>
                <p className="">{data?.stats.avgScore.toFixed(2)}</p>
                <Star size={14} color="yellow" />
              </div>
              <div className="flex flex-col py-1 px-2 bg-amethyst-smoke-700/30">
                <div className="flex flex-row flex-wrap items-center gap-x-3 rounded-sm text-2xs">
                  <div className="flex flex-row items-center capitalize gap-x-1 blue-link">
                    <Star size={12} className="stroke-blue-800 dark:stroke-blue-400" />
                    <p>{data?.stats.recommended}</p>
                    <p>recommended</p>
                  </div>
                  <div className="flex flex-row items-center capitalize gap-x-1 gray-link">
                    <Star size={12} className="stroke-gray-800 dark:stroke-gray-400" />
                    <p>{data?.stats.mixedFeelings}</p>
                    <p>mixed feelings</p>
                  </div>
                  <div className="flex flex-row items-center capitalize gap-x-1 rose-link">
                    <Star size={12} className="stroke-rose-800 dark:stroke-rose-400" />
                    <p>{data?.stats.notRecommended}</p>
                    <p>not recommended</p>
                  </div>
                </div>
                <div
                  style={{
                    backgroundImage: `linear-gradient(90deg, var(--color-blue-400) ${((data?.stats.recommended - 1.5) * 100) / data?.stats.all}%, var(--color-gray-400) ${((data?.stats.recommended + 1.5) * 100) / data?.stats.all}%, var(--color-gray-400) ${((data?.stats.recommended + data?.stats.mixedFeelings - 1.5) * 100) / data?.stats.all}%, var(--color-rose-400) ${((data?.stats.recommended + data?.stats.mixedFeelings + 1.5) * 100) / data?.stats.all}%)`,
                  }}
                  className="h-1 w-full px-3"
                ></div>
              </div>
              <div className="flex flex-row items-center gap-x-1 text-2xs">
                <ChevronRight size={12} />
                <p>All reviews ({data?.stats.all})</p>
              </div>
            </div>
            {data?.featured.map((review) => (
              <div key={review.mal_id} className="bottom-border">
                <div className="flex flex-col xs:flex-row">
                  <div className="flex flex-col ml-3 xs:m-0 justify-start w-[5%] min-w-10">
                    <a href={review.user.url} className="w-full aspect-square">
                      <img className="w-full h-full object-cover" src={review.user.images.webp.image_url} alt={`${review.user.username}-picture`} />
                    </a>
                  </div>
                  <div className="flex flex-col w-[95%] px-3">
                    <div className="flex flex-row justify-between items-center">
                      <a className="blue-link font-semibold" href={review.user.url}>
                        {review.user.username}
                      </a>
                      <p className="text-2xs/snug font-light">{dateFormatter(review.date)}</p>
                    </div>
                    <div className="flex flex-row justify-between items-start gap-x-2.5">
                      {review.tags.map((t, i) => (
                        <div key={i} className="flex flex-row items-center gap-x-1 px-1.5 border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-400/20">
                          <Star
                            size={14}
                            className={`${t === "Recommended" ? "stroke-blue-800 dark:stroke-blue-400" : t === "Not Recommended" ? "stroke-rose-800 dark:stroke-rose-400 " : "stroke-gray-800 dark:stroke-gray-400"}`}
                          />
                          <p
                            className={`${t === "Recommended" ? "text-blue-800 dark:text-blue-400" : t === "Not Recommended" ? "text-rose-800 dark:text-rose-400" : "text-gray-800 dark:text-gray-400"}`}
                          >
                            {t}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-y-2 w-full py-3">
                      <div className="peer">
                        <input type="checkbox" className="hidden" name={`review-${review.mal_id}`} id={`review-${review.mal_id}`} />
                      </div>
                      <p className="w-full whitespace-pre-wrap max-lines-4 cutoff-text">{review.review}</p>

                      <div className="w-[97%] flex flex-row gap-x-2 items-center justify-between">
                        <div className="flex flex-row flex-wrap space-x-1 items-center">
                          {renderReactions(review.reactions)}
                          <p>{review.reactions.overall}</p>
                        </div>
                        <label
                          htmlFor={`review-${review.mal_id}`}
                          className="text-xs capitalize hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                                                              before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
