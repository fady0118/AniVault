export default function Voice({ voiceData }) {
  return (
    <>
      <div className="h-full w-full flex flex-row justify-between gap-5 overflow-hidden ">
        {/* anime */}
        <div className="flex flex-row items-center gap-2 w-1/2 h-full ">
          <a className="h-full w-1/3 aspect-3/4" href={`/anime/${voiceData.anime.mal_id}`}>
            <img className="w-full h-full object-cover" src={voiceData.anime.images.webp.image_url} alt={voiceData.anime.title} />
          </a>
          <a className="h-[85%]" href={`/anime/${voiceData.anime.mal_id}`}>
            <p className="text-2xs lg:text-xs text-left text-blue-400">{voiceData.anime.title}</p>
          </a>
        </div>
        {/* character */}
        <div className="flex flex-row-reverse items-center gap-2 w-1/2 h-full">
          <a className="h-full w-1/3 aspect-3/4" href={`/character/${voiceData.character.mal_id}`}>
            <img className="w-full h-full object-cover" src={voiceData.character.images.webp.image_url} alt={voiceData.character.name} />
          </a>
          <div className="h-[85%] text-2xs lg:text-xs text-right flex flex-col gap-1">
            <a href={`/character/${voiceData.character.mal_id}`}>
              <p className="text-blue-400">{voiceData.character.name}</p>
            </a>
            <p>{voiceData.role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
