export default function Slide({ animeData }) {
  console.log(animeData);
  const gradientStyles = `bg-[linear-gradient(0deg,#e7e6ee_20%,#e7e6eea8_50%,transparent_65%)] dark:bg-[linear-gradient(0deg,#1b1e1f_20%,#1b1e1fab_50%,transparent_65%)] sm:bg-[linear-gradient(90deg,#e7e6ee_50%,#e7e6eea8_65%,transparent_100%)] sm:dark:bg-[linear-gradient(90deg,#1b1e1f_50%,#1b1e1fab_65%,transparent_100%)]`
  return (
    <>
      <div className={`relative slide w-full h-full flex justify-end items-center shrink-0 text-6xl `}>
        <div className="w-full h-full absolute top-0 left-0 "></div>
        <div className={`absolute z-20 top-0 left-0 w-full sm:w-2/3 h-full flex flex-col justify-end items-start ${gradientStyles}`}>
          <div className="w-[60%] h-1/2 sm:h-2/3 flex justify-start ml-6">
            <div className="w-full text-xl sm:text-3xl font-extrabold">{animeData.title}</div>
          </div>
        </div>
        <img className="min-h-screen w-full sm:w-2/3 aspect-auto object-top object-cover" src={animeData.images.jpg.large_image_url} alt={animeData.title} />
      </div>
    </>
  );
}