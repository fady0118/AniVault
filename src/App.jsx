import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import NavBar from "./components/NavBar";
import { getCurrentTheme, themeToggler } from "./utility/utils";

function App() {
  const [theme, setTheme] = useState(getCurrentTheme());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const themeSelect = useCallback((themeValue) => {
    // update theme value in localStorage
    switch (themeValue) {
      case "light":
        localStorage.setItem("theme", "light");
        break;
      case "dark":
        localStorage.setItem("theme", "dark");
        break;
      default:
        localStorage.removeItem("theme");
        break;
    }
    // render new theme
    themeToggler();
  }, []);

  useEffect(() => {
    themeToggler();
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
    return () =>
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
  }, []);

  return (
    <div className="">
      <NavBar themeSelect={themeSelect} theme={theme} setTheme={setTheme} windowWidth={windowWidth}/>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
