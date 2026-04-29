export default function Slide({ animeData }) {
  console.log(animeData);
  return (
    <>
      <div className={`relative slide w-full h-full flex justify-center items-center shrink-0 text-6xl  `}>
        <div className="w-full h-full absolute top-0 left-0 bg-[linear-gradient(90deg,#1b1e1f_0%,transparent_25%,transparent_75%,#1b1e1f_100%)]"></div>
        <img className="w-full aspect-auto " src={animeData.images.webp.large_image_url} alt="" />
      </div>
    </>
  );
}
