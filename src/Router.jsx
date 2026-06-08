import { createBrowserRouter, useRouteError } from "react-router";
import App from "./App";
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
import ErrorComponent from "./components/ErrorComponent";
import UserProfilePage from "./pages/UserProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: HomePage },
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
            children: [{ path: ":year/:season", Component: AnimeSeasonPage }],
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
      { path: "profile", children: [{ index: true, Component: UserProfilePage }] },
    ],
  },
]);

function RootErrorBoundary() {
  let error = useRouteError();
  const message = error?.statusText || error?.message || "Unknown error";
  return (
    <>
      <ErrorComponent error={message} />
    </>
  );
}
