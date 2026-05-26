import { Play } from "lucide-react";
import { getYouTubeThumbnail } from "../../utility/utils";

export default function Video({ data, playVideo }) {
  const thumbnail = getYouTubeThumbnail(data.trailer.embed_url);
  return (
    <div
      onClick={() => {
        playVideo(data.trailer.embed_url);
      }}
      className="group relative w-full aspect-video rounded-md overflow-hidden hover:scale-105 hover:cursor-pointer duration-200"
    >
      <img className="w-full h-full object-cover group-hover:brightness-75 duration-200" src={thumbnail} alt={data.title} />
      <Play className="absolute top-1/2 left-1/2 -translate-1/2 box-content stroke-0 fill-white bg-dark-amethyst-smoke-950 px-4 p-2 rounded-xl" size={20} />
    </div>
  );
}
