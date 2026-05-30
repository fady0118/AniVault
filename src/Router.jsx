import { createBrowserRouter, useRouteError } from "react-router";
import App from "./App";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AnimePage from "./pages/Anime/AnimePage";
import CharacterPage from "./pages/CharacterPage";
import PeoplePage from "./pages/PeoplePage";
import MangaPage from "./pages/Manga/MangaPage";
import MangaRootPage from "./pages/Manga/MangaRootPage";
import MagazinesRootPage from "./pages/Manga/MagazinesRootPage";
import MagazinePage from "./pages/Manga/MagazinePage";
import ProducerPage from "./pages/ProducerPage";
import UserPage from "./pages/UserPage";
import AnimeRootPage from "./pages/Anime/AnimeRootPage";
import AnimeSeasonPage from "./pages/Anime/AnimeSeasonPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      { path: "auth", Component: AuthPage },
      {
        path: "anime",
        children: [
          { index: true, Component: AnimeRootPage },
          {
            path: ":id",
            children: [{ index: true, Component: AnimePage }],
          },
          {
            path: "seasons",
            children:[{path:":year/:season", Component: AnimeSeasonPage,}]
          },
        ],
      },

      {
        path: "manga",
        children: [
          { index: true, Component: MangaRootPage },
          {
            path: "magazine",
            children: [
              { index: true, Component: MagazinesRootPage },
              { path: ":id", Component: MagazinePage },
            ],
          },
          { path: ":id", Component: MangaPage },
        ],
      },
      { path: "character/:id", Component: CharacterPage },
      { path: "people/:id", Component: PeoplePage },
      { path: "producer", children: [{ path: ":id", Component: ProducerPage }] },
      { path: "user", children: [{ path: ":username", Component: UserPage }] },
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
