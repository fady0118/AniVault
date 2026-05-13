import { ChevronLeft, ChevronRight, CircleX } from "lucide-react";
import { useContext, useEffect } from "react";
import { WindowContext } from "../../App";

const classes = {
  imageHoverAnimation: "hover:cursor-pointer hover:scale-105 hover:border-4 hover:border-amethyst-smoke-400/30 transition-transform duration-300",
  activeImage: "border-4 border-blue-500/75",
  arrows:
    "absolute top-1/2 -translate-y-1/2 xs:static bg-amethyst-smoke-950/70 hover:bg-amethyst-smoke-950/50 xs:bg-transparent hover:cursor-pointer xs:hover:bg-amethyst-smoke-400/20 rounded-full p-1 box-content",
};

export default function Gallery({ pictures, name, activeIndex, closeGallery, onNext, onPrev, onOpen }) {
  if (!pictures.length) return;
  const { windowWidth } = useContext(WindowContext);
  // arrow navigation
  function handleGalleryActions(e) {
    if (e.key === "ArrowLeft") {
      onPrev();
    } else if (e.key === "ArrowRight") {
      onNext();
    } else if (e.key === "Escape") {
      closeGallery();
    }
  }
  useEffect(() => {
    document.documentElement.addEventListener("keydown", handleGalleryActions);
    return () => document.documentElement.removeEventListener("keydown", handleGalleryActions);
  }, []);

  // scroll into view
  useEffect(() => {
    if (activeIndex === null) return;
    const galleryMapEl = document.getElementById("galleryMap");
    if (!galleryMapEl) return;
    const galleryMapImages = Array.from(galleryMapEl.querySelectorAll("div.mini-img"));
    const imageNode = galleryMapImages.find((img) => Number(img.dataset.index) === activeIndex);
    if (imageNode) {
      imageNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  return (
    <div id="galleryModal" className="relative">
      <div className="z-30 fixed top-1/2 left-1/2 transform -translate-1/2 w-full h-screen flex flex-col items-center justify-center gap-3">
        <div className="z-50 relative flex flex-col justify-between p-2 max-h-5/6 w-5/6 aspect-3/4 lg:w-4/5 lg:aspect-3/2 box-colors rounded-xl">
          <div className="z-50 absolute top-0 right-0 xs:mx-4 my-3" onClick={closeGallery}>
            <CircleX className="hover:cursor-pointer hover:brightness-125 hover:bg-dark-amethyst-smoke-100/30 rounded-full text-amethyst-smoke-600" size={30} />
          </div>
          <div className="flex justify-evenly items-center h-full xs:h-4/5">
            <ChevronLeft
              onClick={() => {
                onPrev();
              }}
              className={`left-0 ${classes.arrows}`}
              size={windowWidth <= 480 ? 27 : 36}
            />
            <img
              key={activeIndex}
              className="h-full w-auto aspect-auto object-cover rounded-lg gallery-image-animation"
              src={pictures[activeIndex].jpg.large_image_url||pictures[activeIndex].jpg.image_url}
              alt={`${name ?? "unknown"}-picture`}
            />
            <ChevronRight
              onClick={() => {
                onNext();
              }}
              className={`right-0 ${classes.arrows}`}
              size={windowWidth <= 480 ? 27 : 36}
            />
          </div>
          {windowWidth >= 480 && (
            <div id="galleryMap" className="flex h-1/6 gap-1 p-1 overflow-x-scroll">
              {pictures.map((picture, i) => (
                <div
                  key={i}
                  data-index={i}
                  className={`mini-img aspect-square h-full ${activeIndex === i ? classes.activeImage : ""} ${classes.imageHoverAnimation}`}
                  onClick={() => {
                    onOpen(i);
                  }}
                >
                  <img className="h-full w-full object-cover pointer-events-none" src={picture.jpg.image_url} alt={`${name ?? "unknown"}-picture`} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="z-40 absolute top-0 left-0 scale-105 w-full h-full bg-dark-amethyst-smoke-100/80 backdrop-blur-md"></div>
      </div>
    </div>
  );
}
