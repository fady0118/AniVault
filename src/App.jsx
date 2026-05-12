import { createContext, useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import NavBar from "./components/NavBar";
import { getCurrentTheme, themeToggler } from "./utility/utils";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const WindowContext = createContext(null);
const queryClient = new QueryClient();

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
    <WindowContext value={{ windowWidth }}>
      <QueryClientProvider client={queryClient}>
        <div className="font-inter ">
          <NavBar themeSelect={themeSelect} theme={theme} setTheme={setTheme} windowWidth={windowWidth} />
          <div>
            <Outlet />
          </div>
        </div>
      </QueryClientProvider>
    </WindowContext>
  );
}

export default App;
