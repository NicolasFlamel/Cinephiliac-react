import {
  GameGenreType,
  MovieType,
  MovieDatabaseApiType,
  MovieWithStats,
  MovieTypes,
} from 'types';
import { MovieStatsAPI } from 'types/apiTypes';
import {
  addMoviesToDB,
  getMovieFromDB,
  getMovieListFromDB,
  putMovieDataIntoDB,
} from 'utils/MovieDB';

type FetchMovieList = (
  gameGenre: GameGenreType,
  next?: string,
) => Promise<MovieTypes[]>;
// fetch movie list from api
export const fetchMovieList: FetchMovieList = async (gameGenre, next) => {
  if (!next) {
    const localMovieList = await getMovieListFromDB(gameGenre);
    if (localMovieList.length > 9) return localMovieList;
  }

  console.log('fetching movie list');
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API!,
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
    },
  };
  const url =
    'https://moviesdatabase.p.rapidapi.com' +
    (next
      ? next
      : '/titles?list=top_rated_english_250&startYear=2000' +
        (gameGenre !== 'All-Genres' ? `&genre=${gameGenre}` : ''));

  const response = await fetch(url, { ...options });

  if (!response.ok) throw new Error('Movie list fetch response was not ok');

  const data: MovieDatabaseApiType = await response.json();
  const resultsList: MovieType[] = data.results.map((movie) => ({
    imdbId: movie.id,
    title: movie.titleText.text,
  }));

  if (!data.next) return resultsList;

  const nextData = await fetchMovieList(gameGenre, data.next);
  const fullList = resultsList.concat(nextData);

  if (Number(data.page) === 1) addMoviesToDB(fullList, gameGenre);

  return fullList;
};

// fetch movie list from api
export const fetchMovieStats = async (imdbId: string) => {
  const movie = await getMovieFromDB(imdbId);

  if (movie && 'boxOffice' in movie) return movie;

  const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.REACT_APP_OMDB_Key}`;
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
