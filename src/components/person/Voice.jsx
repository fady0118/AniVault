import { Link } from "react-router";

export default function Voice({ voiceData }) {
  return (
    <>
      <div className="h-full w-full flex flex-row justify-between gap-5 overflow-hidden ">
        {/* anime */}
        <div className="flex flex-row items-center gap-2 w-1/2 h-full ">
          <Link className="h-full w-1/3 aspect-3/4" to={`/anime/${voiceData.anime.mal_id}`}>
            <img className="w-full h-full object-cover" src={voiceData.anime.images.webp.image_url} alt={voiceData.anime.title} />
          </Link>
          <Link className="h-[85%]" to={`/anime/${voiceData.anime.mal_id}`}>
            <p className="text-2xs lg:text-xs text-left blue-link">{voiceData.anime.title}</p>
          </Link>
        </div>
        {/* character */}
        <div className="flex flex-row-reverse items-center gap-2 w-1/2 h-full">
          <Link className="h-full w-1/3 aspect-3/4" to={`/character/${voiceData.character.mal_id}`}>
            <img className="w-full h-full object-cover" src={voiceData.character.images.webp.image_url} alt={voiceData.character.name} />
          </Link>
          <div className="h-[85%] text-2xs lg:text-xs text-right flex flex-col gap-1">
            <Link to={`/character/${voiceData.character.mal_id}`}>
              <p className="blue-link">{voiceData.character.name}</p>
            </Link>
            <p>{voiceData.role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
