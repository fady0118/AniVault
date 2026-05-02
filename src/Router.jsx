import { createBrowserRouter, useRouteError } from "react-router";
import App from "./App";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AnimePage from "./pages/AnimePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      { path: "auth", Component: AuthPage },
      { path: "anime/:id", Component: AnimePage },
    ],
  },
]);

function RootErrorBoundary() {
  let error = useRouteError();
  return (
    <>
      <h1 className="text-2xl absolute top-1/2 left-1/2 -translate-1/2">App ran into an error</h1>
      <h1>
        {error.status} {error.statusText}
      </h1>
      <p>{error.data}</p>
    </>
  );
}
