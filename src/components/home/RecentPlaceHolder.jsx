export default function RecentPlaceHolder() {
  return (
    <>
      {Array.from({ length: 25 }, (_, i) => i).map((item, i) => (
        <div key={i} className="flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3 rounded-lg">
          <div className="w-full aspect-3/4 rounded-lg overflow-hidden skeleton box-colors-stronger"></div>
        </div>
      ))}
    </>
  );
}
