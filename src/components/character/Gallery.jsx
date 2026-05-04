import { ChevronLeft, ChevronRight, CircleX } from "lucide-react";
import { useEffect } from "react";
const classes = {
  imageHoverAnimation: "hover:cursor-pointer hover:scale-105 hover:border-4 hover:border-amethyst-smoke-400/30 transition-transform duration-300",
  activeImage: "border-4 border-blue-500/75",
};
export default function Gallery({ closeGallery, dispatch, characterData, state }) {
  // arrow navigation
  function handleArrowNavigation(e) {
    if (e.key === "ArrowLeft") {
      dispatch({ type: "prev" });
    } else if (e.key === "ArrowRight") {
      dispatch({ type: "next" });
    }
  }
  useEffect(() => {
    document.documentElement.addEventListener("keydown", handleArrowNavigation);
    return () => document.documentElement.removeEventListener("keydown", handleArrowNavigation);
  }, []);

  // scroll into view
  useEffect(() => {
    if (state.picIndex === null) return;
    const galleryMapImages = document.getElementById("galleryMap").querySelectorAll("div.mini-img");
    const imageNode = Array.from(galleryMapImages).find((img) => Number(img.dataset.index) === state.picIndex);
    if (imageNode) {
      imageNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [state.picIndex]);

  return (
    <div id="galleryModal" className="relative">
      <div className="z-30 fixed top-1/2 left-1/2 transform -translate-1/2 w-full h-screen flex flex-col items-center justify-center gap-3">
        <div className="z-50 w-6/7 flex justify-end" onClick={closeGallery}>
          <CircleX className="hover:cursor-pointer hover:brightness-125 hover:bg-dark-amethyst-smoke-100/30 rounded-full text-amethyst-smoke-600" size={30} />
        </div>
        <div className="z-50 flex flex-col justify-between p-2 w-5/6 aspect-5/4 sm:w-4/5 sm:max-h-5/6 sm:aspect-3/2 box-colors rounded-xl">
          <div className="flex justify-evenly items-center h-4/5">
            <ChevronLeft
              onClick={() => {
                dispatch({ type: "prev" });
              }}
              className="hover:cursor-pointer hover:bg-amethyst-smoke-400/20 rounded-full p-1 box-content"
              size={36}
            />
            <img className="h-full w-auto aspect-auto object-cover rounded-lg" src={characterData.pictures[state.picIndex].jpg.image_url} alt={`${characterData.name}-picture`} />
            <ChevronRight
              onClick={() => {
                dispatch({ type: "next" });
              }}
              className="hover:cursor-pointer hover:bg-amethyst-smoke-400/20 rounded-full p-1 box-content"
              size={36}
            />
          </div>
          <div id="galleryMap" className="flex h-1/6 gap-1 p-1 overflow-x-scroll">
            {characterData.pictures.map((picture, i) => (
              <div
                key={i}
                data-index={i}
                className={`mini-img aspect-square h-full ${state.picIndex === i ? classes.activeImage : ""} ${classes.imageHoverAnimation}`}
                onClick={() => {
                  dispatch({ type: "open", newIndex: i });
                }}
              >
                <img className="h-full w-full object-cover pointer-events-none" src={picture.jpg.image_url} alt={`${characterData.name}-picture`} />
              </div>
            ))}
          </div>
        </div>
        <div className="z-40 absolute top-0 left-0 scale-105 w-full h-full bg-dark-amethyst-smoke-100/80 backdrop-blur-md"></div>
      </div>
    </div>
  );
}
