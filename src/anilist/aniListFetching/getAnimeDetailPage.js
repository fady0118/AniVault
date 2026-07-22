import { getFriendlyErrorMessage } from '../../utility/errorMapping'
import {
  adaptAnimeDetail,
  adaptAnimeThemes,
  adaptCharacters,
  adaptRecommendations,
  adaptReviews
} from '../adapters/adaptAnime'
import { fetchAnimeThemesById } from '../AnimeThemes/animeThemes'
import { queryAniList } from '../client'
import { ANIME_DETAIL_QUERY } from '../queries/animeDetail'
import { ANIME_MANGA_CHARACTERS_QUERY } from '../queries/animeMangaCharactersQuery'
import { getTmdbImagesAndVideos } from '../TMDB/tmdb'
import { queryAniListCharactersById } from './queryAniListCharactersById'

export async function getAnimeMetaData (id) {
  try {
    const aniListResult = await queryAniList(ANIME_DETAIL_QUERY, {
      id: Number(id)
    })
    const tmdbResult = await getTmdbImagesAndVideos(
      aniListResult?.Media.title.english,
      Number(id),
      import.meta.env.VITE_TMDB_KEY
    )
    const adaptedData = {
      anime: adaptAnimeDetail(aniListResult?.Media),
      reviews: adaptReviews(aniListResult?.Media),
      recommendations: adaptRecommendations(aniListResult?.Media),
      pictures: tmdbResult?.pictures ?? [],
      videos: tmdbResult?.videos ?? []
    }
    return adaptedData
  } catch (error) {
    console.log(error)
    const customError = new Error("couldn't  fetch anime data")
    customError.status = error?.status || 500
    throw customError
  }
}

export async function getItemCharactersData (id, mediaType) {
  try {
    const allEdges = []
    for await (const edgesChunk of queryAniListCharactersById(
      id,
      ANIME_MANGA_CHARACTERS_QUERY,
      mediaType
    )) {
      allEdges.push(...edgesChunk)
    }
    return {
      characters: adaptCharacters(allEdges)
    }
  } catch (error) {
    console.error("Couldn't fetch anime characters:", error)
    const customError = new Error("Couldn't fetch anime characters")
    customError.status = error?.status || 500
    throw customError
  }
}

export async function getAnimeThemesData (id) {
  try {
    const animeThemes = await fetchAnimeThemesById(Number(id))
    const adaptedData = {
      themes: adaptAnimeThemes(animeThemes)
    }
    return adaptedData
  } catch (error) {
    console.log("couldn't fetch anime themes")
    const customError = new Error("couldn't fetch anime themes")
    customError.status = error?.status || 500
    throw customError
  }
}
