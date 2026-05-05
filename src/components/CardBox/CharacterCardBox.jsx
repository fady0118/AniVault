import { useState } from "react";
import Box from "./Box";
const classes = {
  name_class:
    "absolute bottom-0 left-0 w-full pointer-events-none text-3xs bg-amethyst-smoke-200/70 text-text-light dark:bg-dark-amethyst-smoke-200/70 dark:text-text-dark max-lines-1 cutoff-text-abs",
  role_class: "absolute top-0 right-0 bg-amethyst-smoke-200/70 text-text-light dark:bg-dark-amethyst-smoke-200/70 dark:text-text-dark",
  image_class: "w-full aspect-square object-cover hover:cursor-pointer hover:border-4 hover:border-amethyst-smoke-400/30 duration-100",
  responsive_text: "text-3xs sm:text-2xs md:text-3xs xl:text-2xs",
};
export default function CharacterCardBox({ dataArr }) {
  const [showAllPics, setShowAllPics] = useState(false);
  const transformedDataArr = dataArr?.map(({ ...rest }) => {
    const [data1, data2] = Object.values(rest);
    return {
      data1,
      data2,
    };
  });

  return (
    <div className="overflow-x-scroll flex mt-2 mx-2 space-x-0.5">
      {transformedDataArr.slice(0, 10).map((dataEntry, i) => (
        <div key={i} className="flex flex-col w-1/6 min-w-18 shrink-0">
          <Box dataObj={{ data: dataEntry.data1 }} classes={classes} />
          <Box dataObj={{ data: dataEntry.data2 }} classes={classes} />
        </div>
      ))}
      {!showAllPics && transformedDataArr.slice(10).length ? (
        <div
          onClick={() => {
            setShowAllPics(true);
          }}
          className="group w-1/6 min-w-18 shrink-0 text-xl border-4 border-amethyst-smoke-400/30"
        >
          <p className="w-full h-full flex justify-center items-center  group-hover:cursor-pointer group-hover:scale-105 group-hover:bg-amethyst-smoke-400/15 duration-100">
            +{transformedDataArr.slice(10).length}
          </p>
        </div>
      ) : (
        ""
      )}
      {transformedDataArr.slice(10).length && showAllPics ? (
        <>
          {transformedDataArr.slice(10).map((dataEntry, i) => (
            <div key={i} className="flex flex-col w-1/6 min-w-18 shrink-0">
              <Box dataObj={{ data: dataEntry.data1 }} classes={classes} />
              <Box dataObj={{ data: dataEntry.data2 }} classes={classes} />
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
