import { useState } from "react";

export default function Pictures({ pictures, openGallery, cols }) {
  const [showAllPics, setShowAllPics] = useState(false);
  const classes = {
    pictures: "aspect-2/3 hover:cursor-pointer hover:scale-105 hover:border-4 hover:border-amethyst-smoke-400/30 transition-transform duration-200",
    columnsMap: {
      2: `grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 lg:grid-cols-6`,
      3: "grid-cols-3 2xs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 lg:grid-cols-7",
    },
  };
  return (
    <>
      <div className="border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-md/relaxed capitalize">Pictures</div>
      {!pictures?.length ? (
        <p className="p-3 text-xs font-light">No pictures found.</p>
      ) : (
        <div className={`grid ${classes.columnsMap[cols]} gap-2 p-2`}>
          {pictures.slice(0, 6).map((picture, i) => (
            <div
              data-image-index={i}
              onClick={(e) => {
                openGallery(Number(e.target.dataset.imageIndex));
              }}
              key={`picture-${i}`}
              className={classes.pictures}
            >
              <img className="w-full h-full object-cover pointer-events-none" src={picture.jpg.image_url} alt="" />
            </div>
          ))}
          {!showAllPics && pictures.slice(6).length ? (
            <div
              onClick={() => {
                setShowAllPics(true);
              }}
              className="aspect-2/3 flex justify-center items-center text-xl hover:cursor-pointer hover:scale-105 border-4 border-amethyst-smoke-400/30 transition-transform duration-200"
            >
              +{pictures.slice(6).length}
            </div>
          ) : (
            ""
          )}
          {showAllPics &&
            pictures.slice(6).map((picture, i) => (
              <div
                data-image-index={i + 6}
                onClick={(e) => {
                  openGallery(Number(e.target.dataset.imageIndex));
                }}
                key={`picture-${i + 6}`}
                className={classes.pictures}
              >
                <img className="w-full h-full object-cover pointer-events-none" src={picture.jpg.image_url} />
              </div>
            ))}
        </div>
      )}
    </>
  );
}
