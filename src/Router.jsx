import { createBrowserRouter, useRouteError } from 'react-router'
import App from './App'
import HomePage from './pages/HomePage'
import AnimePage from './pages/Anime/AnimePage'
import CharacterPage from './pages/CharacterPage'
import PeoplePage from './pages/PeoplePage'
import MangaPage from './pages/Manga/MangaPage'
import MangaRootPage from './pages/Manga/MangaRootPage'
import ProducerPage from './pages/ProducerPage'
import AnimeRootPage from './pages/Anime/AnimeRootPage'
import AnimeSeasonPage from './pages/Anime/AnimeSeasonPage'
import ErrorComponent from './components/ErrorComponent'
import UserProfilePage from './pages/user/userProfile/UserProfilePage'
import UserProfileEditPage from './pages/user/userProfile/UserProfileEditPage'
import ProfileLayout from './pages/user/userProfile/ProfileLayout'
import OtherUserProfilePage from './pages/user/OtherUser/OtherUserProfilePage'
import UserCustomListPage from './pages/user/UserLists/UserCustomListPage'
import OtherUserCustomListPage from './pages/user/OtherUser/OtherUserCustomListPage'
import OtherProfileLayout from './pages/user/OtherUser/OtherProfileLayout'
import UserProfileEditEmailPasswordPage from './pages/user/ProfileEditEmailPassword/UserProfileEditEmailPasswordPage'
import OAuthRedirect from './pages/OAuthRedirect'
import EmailVerificationRedirect from './pages/user/Redirects/EmailVerificationRedirect'
import ProfileVerification from './pages/user/userProfile/ProfileVerification'
import PasswordResetRedirect from './pages/user/Redirects/PasswordResetRedirect'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'anime',
        children: [
          { index: true, Component: AnimeRootPage },
          {
            path: ':id',
            children: [{ index: true, Component: AnimePage }]
          },
          {
            path: 'seasons',
            children: [{ path: ':year/:season', Component: AnimeSeasonPage }]
          }
        ]
      },

      {
        path: 'manga',
        children: [
          { index: true, Component: MangaRootPage },
          { path: ':id', Component: MangaPage }
        ]
      },
      { path: 'character/:id', Component: CharacterPage },
      { path: 'people/:id', Component: PeoplePage },
      {
        path: 'producer',
        children: [{ path: ':id', Component: ProducerPage }]
      },
      {
        path: 'profile',
        Component: ProfileLayout,
        children: [
          { index: true, Component: UserProfilePage },
          {
            path: 'profile_edit',
            children: [
              { index: true, Component: UserProfileEditPage },
              {
                path: 'edit_email_password',
                Component: UserProfileEditEmailPasswordPage
              }
            ]
          },
          {
            path: 'userList/:id',
            children: [{ index: true, Component: UserCustomListPage }]
          },
          {
            path: 'verify',
            Component: ProfileVerification
          }
        ]
      },
      {
        path: 'userProfile',
        children: [
          {
            path: ':userId',
            Component: OtherProfileLayout,
            children: [
              { index: true, Component: OtherUserProfilePage },
              {
                path: 'userList/:id',
                children: [{ index: true, Component: OtherUserCustomListPage }]
              }
            ]
          }
        ]
      },
      {
        path: 'OAuthRedirect',
        Component: OAuthRedirect
      },
      {
        path: 'emailVerification',
        Component: EmailVerificationRedirect
      },
      {
        path: 'passwordReset',
        Component: PasswordResetRedirect
      }
    ]
  }
])

function RootErrorBoundary () {
  let error = useRouteError()
  const message = error?.statusText || error?.message || 'Unknown error'
  return (
    <>
      <ErrorComponent error={message} />
    </>
  )
}
