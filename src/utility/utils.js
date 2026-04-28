export function themeToggler() {
  console.log("theme toggle");
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
