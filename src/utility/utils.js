export function themeToggler() {
  // get local & os theme value
  const localTheme = localStorage.getItem("theme");
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // modify the html theme class
  if (localTheme === "dark" || (!("theme" in localStorage) && isDarkMode)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function getCurrentTheme() {
  return localStorage.getItem("theme");
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

// API functions
export function getSeason(date) {
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
    return "Autumn";
  }
  return "Winter";
}
