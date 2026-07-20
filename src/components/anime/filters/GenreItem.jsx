import { Square, SquareMinus, SquarePlus } from "lucide-react";

export default function GenreItem({ name, localState, handleClick }) {
  return (
    <div
      id={name}
      onClick={() => {
        handleClick(name);
      }}
      className={`w-full flex flex-row items-center justify-between px-1 rounded-xs hover:cursor-pointer ${localState[name] === 1 ? "bg-emerald-500/50 hover:bg-emerald-400/75" : localState[name] === -1 ? "bg-amethyst-smoke-600/25 dark:bg-dark-amethyst-smoke-100/75 hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75" : "hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75"}`}
    >
      <div className="flex flex-row items-center gap-x-0.5">
        <>
          {localState[name] === 1 ? (
            <SquarePlus className="stroke-2 stroke-emerald-500 fill-amethyst-smoke-200" size={12} />
          ) : localState[name] === -1 ? (
            <SquareMinus className="stroke-2 stroke-rose-500 fill-amethyst-smoke-600/25 dark:fill-dark-amethyst-smoke-200 " size={12} />
          ) : (
            <Square className="stroke-0 fill-amethyst-smoke-200" size={12} />
          )}
        </>
        <p className={`${name.length > 3 ? "capitalize" : "uppercase"}`}>{name}</p>
      </div>
    </div>
  );
}
