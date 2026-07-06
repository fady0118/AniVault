export default function EmptyDataFallback({string = "no data found"}) {
  return (
    <div className="capitalize p-3 rounded-md border-dark-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10 text-rose-500 dark:text-rose-400 box-colors ">
      {string}
    </div>
  );
}
