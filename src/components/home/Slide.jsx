export default function Slide({ animeData }) {
  console.log(animeData);
  return (
    <>
      <div className={`relative slide w-full h-full flex justify-end items-center shrink-0 text-6xl `}>
        <div className="w-full h-full absolute top-0 left-0 bg-[linear-gradient(90deg,#e7e6ee_0%,transparent_25%)] dark:bg-[linear-gradient(90deg,#1b1e1f_0%,transparent_25%)]"></div>
        <div className="absolute z-20 top-0 left-0 w-2/3 h-full flex flex-col justify-end items-start bg-[linear-gradient(90deg,#e7e6ee_0%,#e7e6ee_50%,transparent_100%)] dark:bg-[linear-gradient(90deg,#1b1e1f_0%,#1b1e1f_50%,transparent_100%)]">
          <div className="w-[60%] h-2/3 flex justify-start ml-6">
            <div className="w-full text-3xl font-extrabold">{animeData.title}</div>
          </div>
        </div>
        <img className="min-h-screen w-2/3 aspect-auto object-top object-cover" src={animeData.images.jpg.large_image_url} alt={animeData.title} />
      </div>
    </>
  );
}