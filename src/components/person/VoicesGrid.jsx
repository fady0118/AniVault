import { useState } from "react";
import Voice from "./Voice";

export default function VoicesGrid({ voices }) {
  const [showAllPics, setShowAllPics] = useState(false);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-2 lg:gap-x-5 p-3">
      {voices.slice(0, 15).map((voice, i) => (
        <Voice key={i} voiceData={voice} />
      ))}
      {!showAllPics && voices.slice(15).length ? (
        <div
          onClick={() => {
            setShowAllPics(true);
          }}
          className="h-full w-full flex justify-center items-center overflow-hidden text-xl border-4 border-amethyst-smoke-400/30 hover:border-amethyst-smoke-400/60 hover:cursor-pointer duration-150"
        >
          +{voices.slice(15).length}
        </div>
      ) : (
        ""
      )}
      {showAllPics && voices.slice(15).length ? (
        <>
          {voices.slice(15).map((voice, i) => (
            <Voice key={i} voiceData={voice} />
          ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
