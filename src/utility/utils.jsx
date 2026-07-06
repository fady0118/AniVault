import { LinkIcon } from "lucide-react";
import { Link } from "react-router";

// theme detecting and toggling function
export function themeToggler() {
  // get local & os theme value
  const localTheme = localStorage.getItem("theme");
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // modify the html theme class
  if (localTheme === "dark" || (!("theme" in localStorage) && prefersDarkMode)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function getCurrentTheme() {
  // return localStorage.getItem("theme");
  const localTheme = localStorage.getItem("theme");
  switch (localTheme) {
    case "dark":
      return "dark";
    case "light":
      return "light";
    default:
      return "os";
  }
}

// helper function for getting the season from a date string
export function getSeason(d) {
  const date = new Date(d);
  const currentDate = date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
  const [month, day] = currentDate.split("/").map((i) => Number(i));
  if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day < 21)) {
    return "Spring";
  }
  if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 21)) {
    return "Summer";
  }
  if ((month === 9 && day >= 21) || month === 10 || month === 11 || (month === 12 && day < 21)) {
    return "Fall";
  }
  return "Winter";
}
// helper function for getting the season from a date string
export function getYear(d) {
  const date = new Date(d);
  const currentDate = date.toLocaleDateString("en-US", { year: "numeric" });
  return currentDate;
}

// render function for information section for string data
export function renderInfoStr(title, str, link = null) {
  return (
    <div className="w-full flex flex-row flex-wrap gap-x-1 items-end capitalize">
      <p className="font-semibold ">{title}:</p>
      {link ? (
        <Link to={link} className="text-[0.9em] blue-link">
          {str.trim() || "?"}
        </Link>
      ) : (
        <p className="text-[0.9em]">{str.trim() || "?"}</p>
      )}
    </div>
  );
}

// render function for information section for array data
export function renderInfoArr(title, arr, path = null) {
  if (!arr?.length) return;
  return (
    <div className="w-full flex flex-row gap-x-1 items-start capitalize">
      <p className="font-semibold ">{title}:</p>
      <div className="flex flex-row flex-wrap">
        {arr.length
          ? arr.map((item, i, arr) => (
              <div key={i}>
                {!path ? (
                  <p className="whitespace-pre-wrap">
                    {item.name}
                    {i !== arr.length - 1 ? ", " : ""}
                  </p>
                ) : (
                  <Link className="blue-link whitespace-pre-wrap" to={`${path}${item.mal_id}`}>
                    {item.name}
                    {i !== arr.length - 1 ? ", " : ""}
                  </Link>
                )}
              </div>
            ))
          : "None found."}
      </div>
    </div>
  );
}

// render function for the external links section that returns an icon imgs for the links data
export function renderIcon(name) {
  if (name.toLowerCase().includes("wikipedia")) {
    return <img className="h-3" alt="Wikipedia icon" src="https://cdn.myanimelist.net/img/common/external_links/202.png" />;
  } else if (name.toLowerCase().startsWith("@") || name.toLowerCase().includes("x.com")) {
    return <img className="h-3" alt="twitter icon" src="https://cdn.myanimelist.net/img/common/external_links/101.png" />;
  }
  switch (name) {
    case "YouTube":
      return <img alt="YouTube icon" className="h-3" src="https://cdn.myanimelist.net/img/common/external_links/102.png" />;
    case "Facebook":
      return (
        <img
          alt="YouTube icon"
          className="h-3"
          src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
        />
      );
    case "AniDB":
      return <img className="h-3" alt="AniDB icon" src="https://cdn.myanimelist.net/img/common/external_links/200.png" />;
    case "ANN":
      return <img className="h-3" alt="ANN icon" src="https://cdn.myanimelist.net/img/common/external_links/201.png" />;
    case "Syoboi":
      return <img className="h-3" alt="Syoboi icon" src="https://cdn.myanimelist.net/img/common/external_links/203.png" />;
    case "Netflix":
      return (
        <img
          className="h-3"
          alt="Crunchyroll icon"
          src="https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
        />
      );
    case "Crunchyroll":
      return <img className="h-3" alt="Crunchyroll icon" src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/crunchyroll.png" />;
    default:
      return <LinkIcon size={12} />;
  }
}

// takes a date string and returns it in a more readable format
export function dateFormatter(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
export function DateTimeFormatter(date) {
  const d = new Date(date);
  return `${d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
}

// simple delay function useful for delaying api calls to avoid running into rate limit rejections
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// render function for the review section that returns an emoji representation for the reactions data
export function renderReactions(reactions) {
  const reactionsArr = { nice: "😊", love_it: "😍", funny: "😂", confusing: "🤔", informative: "💡", well_written: "🧠", creative: "🎨" };
  const rects = Object.entries(reactions)
    .filter((r) => r[0] !== "overall")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return (
    <div className="flex flex-col xs:flex-row flex-wrap gap-0.5">
      {rects.map((r, i) =>
        r[1] > 0 ? (
          <div key={i} className="flex flex-row items-center gap-x-0.5 px-0.5 rounded-sm border border-blue-800/50 dark:border-blue-400/50">
            <span>{reactionsArr[r[0]]}</span>
            <span>{((100 * r[1]) / reactions.overall).toFixed(2)}%</span>
          </div>
        ) : (
          ""
        ),
      )}
    </div>
  );
}

// get thumnail from yt embed-url
export function getYouTubeThumbnail(embedUrl, quality = "hqdefault") {
  const match = embedUrl.match(/embed\/([^?&/]+)/);
  if (!match) {
    return null;
  }
  const videoId = match[1];
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
