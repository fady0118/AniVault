import { useState } from "react";
import Box from "./Box";
const classes = {
  name_class:
    "absolute bottom-0 left-0 w-full pointer-events-none text-3xs bg-amethyst-smoke-200/70 text-text-light dark:bg-dark-amethyst-smoke-200/70 dark:text-text-dark max-lines-1 cutoff-text-abs",
  role_class: "absolute top-0 right-0 bg-amethyst-smoke-200/70 text-text-light dark:bg-dark-amethyst-smoke-200/70 dark:text-text-dark",
  responsive_text: "text-2xs sm:text-2xs md:text-xs xl:text-sm",
};
export default function CardBox({ dataArr, num = 6, aspect = "square" }) {
  const [showAllPics, setShowAllPics] = useState(false);
  const transformedDataArr = dataArr?.map(({ ...rest }) => {
    const [data1, data2] = Object.values(rest);
    return {
      data1,
      data2,
    };
  });
  const widthClass = {
    4: "w-1/4",
    5: "w-1/5",
    6: "w-1/6",
    7: "w-1/7",
    8: "w-1/8",
  };

  const image_class = `inline-block w-full aspect-${aspect} object-cover hover:cursor-pointer hover:border-4 hover:border-amethyst-smoke-400/30 duration-100`;

  return (
    <div className="overflow-x-scroll no-scrollbar flex mt-2 mx-2 space-x-0.5">
      {transformedDataArr.slice(0, 10).map((dataEntry, i) => (
        <div key={i} className={`flex flex-col ${widthClass[num]} min-w-18 shrink-0`}>
          <Box dataObj={{ data: dataEntry.data1 }} classes={classes} image_class={image_class} />
          <Box dataObj={{ data: dataEntry.data2 }} classes={classes} image_class={image_class} />
        </div>
      ))}
      {!showAllPics && transformedDataArr.slice(10).length ? (
        <div
          onClick={() => {
            setShowAllPics(true);
          }}
          className={`group ${widthClass[num]} min-w-18 shrink-0 text-xl border-4 border-amethyst-smoke-400/30`}
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
            <div key={i} className={`flex flex-col ${widthClass[num]} min-w-18 shrink-0`}>
              <Box dataObj={{ data: dataEntry.data1 }} classes={classes} image_class={image_class} />
              <Box dataObj={{ data: dataEntry.data2 }} classes={classes} image_class={image_class} />
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
}