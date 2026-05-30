import { useEffect } from "react";
import { Link } from "react-router";

export default function FriendsModal({ data, setShowFriendsModal }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowFriendsModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="z-50 flex flex-col rounded-lg fixed top-1/2 left-1/2 transform -translate-1/2 w-6/7 h-6/7 sm:w-3/4 sm:h-4/5 max-w-3xl">
        <div className="flex justify-between items-center p-2">
          <div className="w-full flex flex-row-reverse">
            <button
              onClick={() => {
                setShowFriendsModal(false);
              }}
              className=" w-fit flex items-center text-xs px-1 rounded-sm border border-amethyst-smoke-800/70 text-amethyst-smoke-300 dark:border-amethyst-smoke-500/40  hover:cursor-pointer"
            >
              esc
            </button>
          </div>
        </div>
        <div className="w-full p-4 bg-amethyst-smoke-400 dark:bg-dark-amethyst-smoke-200 overflow-y-scroll rounded-sm min-h-2/3">
          <div className="grid grid-cols-1 gap-y-4 overflow-y-scroll">
            {data?.map((f, i) => (
              <div key={i} className="flex justify-start items-center p-3 gap-x-5 rounded-xl bg-amethyst-smoke-300 dark:bg-dark-amethyst-smoke-50/30">
                <Link className="w-1/10 min-w-20" to={`/user/${f?.user?.username}`} target="_blank">
                  <img
                    src={f?.user?.images.webp.image_url || f?.user?.images.jpg.image_url}
                    alt={f.user.username}
                    className="w-full aspect-square rounded-full object-cover"
                  />
                </Link>
                <div className="flex flex-col h-full justify-start py-2.5 gap-y-2">
                  <Link to={`/user/${f?.user?.username}`} className="w-fit text-sm font-medium hover:text-blue-500 truncate block duration-100">
                    {f.user.username}
                  </Link>
                  <p className="text-xs dark:text-amethyst-smoke-200/50 text-dark-amethyst-smoke-50/50">
                    Friends since {new Date(f.friends_since).toLocaleDateString()} · Last online {new Date(f.last_online).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="z-40 fixed top-0 w-screen h-screen bg-dark-amethyst-smoke-50/75"></div>
    </>
  );
}
