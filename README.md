# AniVault

AniVault is a modern anime and manga discovery app built with React, Vite, Tailwind CSS, and Appwrite. It lets users browse anime and manga content from the Jikan API, explore detailed media pages, and manage a personalized library with reviews, custom lists, and progress tracking.

## Overview

AniVault combines public anime/manga discovery with a user account system powered by Appwrite. Users can sign up with email/password or Google OAuth, verify their account, create profiles, and build a personal watchlist and collection of favorite titles.

The project is designed to be responsive and works across desktop, tablet, and mobile screen sizes.

## Key Features

- Browse anime, manga, characters, people, producers, and seasonal content
- Explore detailed pages for anime and manga, including trailers, episodes, staff, relationships, and reviews
- Search and filter content with pagination and multiple filter options
- View recommendations and related media
- Create and manage a personal profile with avatar support
- Sign up with email/password or Google OAuth
- Verify email accounts and reset passwords
- Add titles to a watchlist or library
- Set watch status and progress for anime and manga
- Create custom lists for organizing favorites or planned watches
- Write, edit, and delete reviews
- Switch between light and dark themes and toggle SFW content preferences

## Tech Stack

- Frontend: React, Vite
- Styling: Tailwind CSS, DaisyUI
- Data: Jikan API
- Backend/Auth: Appwrite
- State/Data fetching: React Query
- Routing: React Router

## Project Structure

- src/pages: main app pages such as home, anime, manga, profile, auth, and redirects
- src/components: reusable UI components, modals, and feature sections
- src/Contexts: authentication and app-wide context providers
- src/utility: API helpers, custom hooks, and shared utilities
- appwrite_functions: server-side Appwrite function examples

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm or pnpm
- An Appwrite project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fady0118/AniVault.git
   cd AniVault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your Appwrite configuration:
   ```env
   VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_BUCKET_ID=your_appwrite_bucket_id
   VITE_TABLE_ID_USER_PROFILE=your_user_profile_table_id
   VITE_TABLE_ID_USER_ITEM=your_user_item_table_id
   VITE_TABLE_ID_LIST=your_list_table_id
   VITE_TABLE_ID_LIST_ITEM=your_list_item_table_id
   VITE_TABLE_ID_REVIEWS=your_reviews_table_id
   VITE_FUNCTIONS_DELETE_ACCOUNT=your_delete_account_function_id
   ```

4. Make sure your Appwrite project has:
   - Authentication enabled for email/password and Google OAuth
   - Database and tables for user profiles, items, lists, list items, and reviews
   - Storage enabled for profile avatars
   - Any required server functions configured for account deletion if used

### Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in your terminal.
## Notes

- AniVault depends on the Jikan API for most anime and manga data. The API has been known to return 504 errors, which can cause some pages or requests to fail when the upstream service is unstable.
- Since i'm unable to self host jikan api for financial reasons, I'm relying on the public api
- Appwrite handles authentication, profile data, user items, reviews, and custom lists reliably and is the backbone of the personalized experience.

## Future Improvement Ideas

- Add more analytics and social features for user lists and reviews, add friends feature
- Polish UX and performance enhancements

