// recentMedia.js
export const RECENT_MEDIA = `
query RecentMedia($page: Int, $perPage: Int, $format: MediaFormat) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
    }
    media(
      format: $format,
      sort: START_DATE_DESC,
      status_in: [RELEASING, FINISHED]
    ) {
      id
      idMal
      type
      title {
        romaji
        english
        native
      }
      description
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      episodes
      chapters
      volumes
      averageScore
      isAdult
      genres
      coverImage {
        extraLarge
        large
        medium
      }
      siteUrl
    }
  }
}`