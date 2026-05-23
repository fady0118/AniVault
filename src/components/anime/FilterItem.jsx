import { Square, SquarePlus } from "lucide-react";

export default function FilterItem({ keyName, item, localState, handleChange }) {
  return (
    <div
      id={item}
      onClick={() => {
        handleChange(item);
      }}
      className={`w-full flex flex-row items-center justify-between px-1 rounded-xs hover:cursor-pointer ${localState.split(",").includes(item) ? "bg-emerald-500/50" : "hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75"}`}
    >
      <div className="flex flex-row items-center gap-x-0.5">
        <>
          {localState.split(",").includes(item) ? (
            <SquarePlus className="stroke-2 stroke-emerald-500 fill-amethyst-smoke-200" size={12} />
          ) : (
            <Square className="stroke-0 fill-amethyst-smoke-200" size={12} />
          )}
        </>
        <p className={`${item.length > 3 ? "capitalize" : "uppercase"}`}>{item}</p>
      </div>
    </div>
  );
}
