import { createContext, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Outlet } from "react-router";
import NavBar from "./components/Navbar/NavBar";
import { getCurrentTheme, themeToggler } from "./utility/utils";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { setSFWValue } from "./utility/jikanApi";
import AuthProvider from "./Contexts/AuthContext";

export const RootContext = createContext(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (i) => Math.min(1000 * 2 ** i, 8000),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      throwOnError: true,
    },
  },
});

function App() {
  const [theme, setTheme] = useState(getCurrentTheme());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [SFW, setSFW] = useState(JSON.parse(localStorage.getItem("SFW")) ?? true);

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

  useEffect(() => {
    // update SFW in localStorage
    localStorage.setItem("SFW", JSON.stringify(SFW));
  }, [SFW]);

  useLayoutEffect(() => {
    // update sfw value in jikanFetch
    setSFWValue(SFW);
  }, [SFW]);

  return (
    <RootContext value={{ windowWidth, SFW, setSFW }}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="font-inter">
            <NavBar themeSelect={themeSelect} theme={theme} setTheme={setTheme} />
            <div>
              <Outlet />
            </div>
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </RootContext>
  );
}

export default App;
