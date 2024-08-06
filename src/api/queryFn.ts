import {
  MovieType,
  MovieDatabaseApiType,
  MovieWithStats,
  MovieTypes,
  MoviePair,
  isGameGenreType,
} from 'types';
import { MovieStatsAPI } from 'types/apiTypes';
import {
  addMoviesToDB,
  getMovieFromDB,
  getMovieListFromDB,
  putMovieDataIntoDB,
} from 'utils/MovieDB';
import { randomIndex } from './helpers';
import { QueryFunctionContext } from '@tanstack/react-query';

type FetchMovieList = (
  context: QueryFunctionContext,
  next?: string,
) => Promise<MovieTypes[]>;

// fetch movie list from api
export const fetchMovieList: FetchMovieList = async (context, next) => {
  const { queryKey, signal } = context;
  const genre = queryKey[1];

  if (!isGameGenreType(genre)) throw new Error('queryKey[1] is not a genre');
  else if (!next) {
    const localMovieList = await getMovieListFromDB(genre);
    if (localMovieList.length > 9) return localMovieList;
  }

  console.log('fetching movie list');
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_APP_RAPID_API,
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
    },
    signal,
  };
  const url =
    'https://moviesdatabase.p.rapidapi.com' +
    (next
      ? next
      : '/titles?list=top_rated_english_250&startYear=2000' +
        (genre !== 'All-Genres' ? `&genre=${genre}` : ''));

  const response = await fetch(url, { ...options });

  if (!response.ok) throw new Error('Movie list fetch response was not ok');

  const data: MovieDatabaseApiType = await response.json();
  const resultsList: MovieType[] = data.results.map((movie) => ({
    imdbId: movie.id,
    title: movie.titleText.text,
  }));

  if (!data.next) return resultsList;

  const nextData = await fetchMovieList(context, data.next);
  const fullList = resultsList.concat(nextData);

  if (Number(data.page) === 1) addMoviesToDB(fullList, genre);

  return fullList;
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
    import.meta.env.VITE_APP_OMDB_Key
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
