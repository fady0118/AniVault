export default function Slide({ animeData }) {
  console.log(animeData);
  return (
    <>
      <div className={`relative slide w-full h-full flex justify-end items-center shrink-0 text-6xl `}>
        <div className="w-full h-full absolute top-0 left-0 bg-[linear-gradient(90deg,#e7e6ee_0%,transparent_25%,transparent_75%,#e7e6ee_100%)] dark:bg-[linear-gradient(90deg,#1b1e1f_0%,transparent_25%,transparent_75%,#1b1e1f_100%)]"></div>
        <div className="absolute z-20 top-0 left-0 w-1/2 h-full flex flex-col justify-end items-center bg-[linear-gradient(90deg,transparent_0%,#e7e6ee_25%,#e7e6ee_100%)] dark:bg-[linear-gradient(90deg,#1b1e1f_0%,#1b1e1f_70%,transparent_100%)]">
          <div className="w-3/4 h-2/3 flex justify-start">
            <div className="text-3xl w-full">{animeData.title}</div>
          </div>
        </div>
        <img className="w-2/3 aspect-auto" src={animeData.images.webp.large_image_url} alt="" />
      </div>
    </>
  );
}
