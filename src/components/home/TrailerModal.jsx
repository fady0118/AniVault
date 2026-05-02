import { CircleX } from "lucide-react";
import { useEffect } from "react";

export default function TrailerModal({ closeModal, link }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="fixed top-0 left-0 flex flex-col space-y-1 justify-center items-center z-50 w-screen h-screen bg-dark-amethyst-smoke-300/85">
      <div onClick={closeModal} className="w-7/8 sm:w-3/4 flex justify-end">
        <CircleX className="hover:cursor-pointer hover:brightness-125 hover:bg-dark-amethyst-smoke-100/30 rounded-full text-amethyst-smoke-600" size={30} />
      </div>
      <div className="rounded-xl overflow-hidden w-7/8 sm:w-2/3 aspect-video">
        <iframe
          className="w-full h-full"
          src={link.split("&autoplay")[0]}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
