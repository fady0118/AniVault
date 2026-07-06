import { Circle, CircleCheckBig } from "lucide-react";

export default function SortItem({ item, localState, handleChange }) {
  return (
    <div
      id={item}
      onClick={() => {
        handleChange(item);
      }}
      className={`w-full flex flex-row items-center justify-between px-1 rounded-xs hover:cursor-pointer ${localState.order_by === item ? "bg-emerald-500/50 hover:bg-emerald-400/75" : "hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-50/75"}`}
    >
      <div className="flex flex-row items-center gap-x-0.5">
        <>
          {localState.order_by === item ? (
            <CircleCheckBig className="stroke-2 stroke-emerald-500 fill-amethyst-smoke-200" size={12} />
          ) : (
            <Circle className="stroke-0 fill-amethyst-smoke-200" size={12} />
          )}
        </>
        <p className="capitalize">{item.split("_").join(" ")}</p>
      </div>
    </div>
  );
}
