import { useState } from "react";

export default function Pictures({ pictures, openGallery, cols }) {
  const [showAllPics, setShowAllPics] = useState(false);
  const classes = {
    pictures: "aspect-2/3 hover:cursor-pointer hover:scale-105 hover:border-4 hover:border-amethyst-smoke-400/30 transition-transform duration-200",
    columnsMap: {
      2: `grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5`,
      3: "grid-cols-3 2xs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6",
    },
  };
  return (
    <>
      <div className="border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize">Pictures</div>
      {!pictures?.length ? (
        <p className="p-3 text-xs font-light">No images found.</p>
      ) : (
        <div className={`grid ${classes.columnsMap[cols]} gap-2 p-2`}>
          {pictures.slice(0, 10).map((picture, i) => (
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
          {!showAllPics && pictures.slice(10).length ? (
            <div
              onClick={() => {
                setShowAllPics(true);
              }}
              className="aspect-2/3 flex justify-center items-center text-xl hover:cursor-pointer hover:scale-105 border-4 border-amethyst-smoke-400/30 transition-transform duration-200"
            >
              +{pictures.slice(10).length}
            </div>
          ) : (
            ""
          )}
          {showAllPics &&
            pictures.slice(10).map((picture, i) => (
              <div
                data-image-index={i + 10}
                onClick={(e) => {
                  openGallery(Number(e.target.dataset.imageIndex));
                }}
                key={`picture-${i + 10}`}
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
