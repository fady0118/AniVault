import { useState } from "react";
import { DateTimeFormatter } from "../../utility/utils";

export default function News({data}) {
  const [showAllNews, setShowAllNews] = useState(false);
  
  return (
    <>
      {data?.length ? (
        <div id="news" className="order-5 rounded-lg box-colors w-full py-1">
          <div className="bottom-border pt-0.5 px-3 font-semibold text-md/relaxed capitalize">news</div>
          <div className="w-full grid grid-cols-1 auto-rows-fr gap-y-2 p-2">
            {data.slice(0, 5).map((article, i) => (
              <div key={i} className="flex flex-row w-full items-start">
                <img className="w-1/12 min-w-14 max-w-20 object-cover aspect-2/3 overflow-hidden font-extralight text-xs" src={article.images.jpg.image_url} alt={article.title} />
                <div className="flex flex-col grow gap-y-1 px-2">
                  <a href={article.url} className="font-semibold text-xs md:text-sm blue-link">
                    {article.title}
                  </a>
                  <p className="text-[0.8em] font-light">{article.excerpt}</p>
                  <div className="flex flex-row items-center gap-x-1.5 text-[0.65em] font-extralight">
                    <p>{DateTimeFormatter(article?.date)}</p>
                    <p className="">
                      By{" "}
                      <a href={article.author_url} className="blue-link font-light">
                        {article.author_username}
                      </a>
                    </p>
                    <p>({article.comments} comments)</p>
                  </div>
                </div>
              </div>
            ))}

            {!showAllNews && data?.length > 5 ? (
              <div
                onClick={() => {
                  setShowAllNews(true);
                }}
                className="flex flex-row justify-center items-center w-full text-2xl border-4 border-amethyst-smoke-400/30 hover:cursor-pointer hover:bg-amethyst-smoke-400/20"
              >
                +{data?.length - 5}
              </div>
            ) : (
              ""
            )}
            {showAllNews
              ? data?.slice(5).map((article, i) => (
                  <div key={i + 5} className="flex flex-row w-full items-start">
                    <img className="w-1/12 min-w-14 max-w-20 object-cover aspect-2/3 overflow-hidden font-extralight text-xs" src={article.images.jpg.image_url} alt={article.title} />
                    <div className="flex flex-col grow gap-y-1 px-2">
                      <a href={article.url} className="font-semibold text-xs md:text-sm blue-link">
                        {article.title}
                      </a>
                      <p className="text-[0.8em] font-light">{article.excerpt}</p>
                      <div className="flex flex-row items-center gap-x-1.5 text-[0.65em] font-extralight">
                        <p>{DateTimeFormatter(article?.date)}</p>
                        <p className="">
                          By{" "}
                          <a href={article.author_url} className="blue-link font-light">
                            {article.author_username}
                          </a>
                        </p>
                        <p>({article.comments} comments)</p>
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
