import { createBrowserRouter } from "react-router";
import App from "./App";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: "auth", Component: AuthPage },
    ],
  },
]);
