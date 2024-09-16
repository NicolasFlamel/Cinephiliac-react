import {
  MovieType,
  MovieWithStats,
  MovieTypes,
  MoviePair,
  isGameGenreType,
} from 'types';
import { MovieStatsAPI, TMDBExternalIds } from 'types/apiTypes';
import {
  addMoviesToDB,
  getMovieFromDB,
  getMovieListFromDB,
  putMovieDataIntoDB,
} from 'utils/MovieDB';
import { randomIndex } from './helpers';
import { fetchMovies, getExternalIds } from './tmdbAPI';
import { QueryFunctionContext } from '@tanstack/react-query';

type FetchMovieList = (
  context: QueryFunctionContext,
  next?: string,
) => Promise<MovieType[]>;

// fetch movie list from api
export const fetchMovieList: FetchMovieList = async (context) => {
  const { queryKey, signal } = context;
  const genre = queryKey[1];

  if (!isGameGenreType(genre)) throw new Error('queryKey[1] is not a genre');
  else {
    const localMovieList = await getMovieListFromDB(genre);
    if (localMovieList.length > 9) return localMovieList;
  }

  console.log('fetching movie list');

  const rawTMDBData = await fetchMovies(genre, { signal });

  const externalIds: TMDBExternalIds[] = await Promise.all(
    getExternalIds(rawTMDBData, { signal }),
  );
  const movieList: MovieType[] = [];

  for (const rawMovie of rawTMDBData) {
    const foundId = externalIds.find(
      (externalId) => externalId.id === rawMovie.id,
    );

    if (!foundId || !foundId.imdb_id) continue;

    movieList.push({
      imdbId: foundId.imdb_id,
      title: rawMovie.title,
      posterUrl: rawMovie.poster_path,
    });
  }

  addMoviesToDB(movieList, genre);

  return movieList;
};

// initial moviePair query fn
export const getMoviePairFn = async (movieList: MovieTypes[] | undefined) => {
  if (!movieList?.length) throw new Error('404 - no movie list');
  const firstIndex = randomIndex(movieList);
  let secondIndex = randomIndex(movieList);

  while (firstIndex === secondIndex) secondIndex = randomIndex(movieList);

  const moviePair: MoviePair = [movieList[firstIndex], movieList[secondIndex]];

  return moviePair;
};

// fetch movie list from api
export const fetchMovieStats = async (imdbId: string) => {
  const movie = await getMovieFromDB(imdbId);

  if (movie && 'boxOffice' in movie) return movie;

  const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${
    import.meta.env.VITE_OMDB_KEY
  }`;
  const response = await fetch(omdbUrl);

  if (!response.ok)
    throw new Error('Movie stats fetch response was not ok', {
      cause: response,
    });

  const data: MovieStatsAPI = await response.json();

  if (data.BoxOffice === 'N/A') throw new Error('NoStats', { cause: imdbId });

  const movieStats: MovieWithStats = {
    imdbId,
    title: data.Title,
    boxOffice: data.BoxOffice,
    posterUrl: data.Poster,
    rating: data.imdbRating,
  };

  // stores in indexedDB
  putMovieDataIntoDB(movieStats);

  return movieStats;
};
