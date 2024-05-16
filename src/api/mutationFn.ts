import { QueryClient } from '@tanstack/react-query';
import { GameGenreType, MoviePair, MovieTypes } from 'types';
import { randomIndex } from './helpers';

export const movieListFn = async (
  qClient: QueryClient,
  gameGenre: GameGenreType,
): Promise<[MovieTypes[], MoviePair]> => {
  const queryKey = ['movieList', gameGenre];
  const movieList = qClient.getQueryData<MovieTypes[]>(queryKey);
  const moviePair = qClient.getQueryData<MoviePair>(['moviePair']);

  if (!movieList || !moviePair) throw new Error('No movie list or pair');

  let newMovie = movieList[randomIndex(movieList)];

  while (newMovie.imdbId === moviePair[1].imdbId)
    newMovie = movieList[randomIndex(movieList)];

  const outMoviePair = (movie: MovieTypes) =>
    moviePair.some(
      (pairMovie: MovieTypes) => pairMovie.imdbId === movie.imdbId,
    ) || movie.imdbId === newMovie.imdbId
      ? false
      : true;

  const newList = movieList.filter(outMoviePair);
  const newPair: MoviePair = [moviePair[1], newMovie];

  return [newList, newPair];
};

type MoviePairFnType = (
  qClient: QueryClient,
  gameGenre: GameGenreType,
  imdbId: string,
) => any;

export const moviePairFn: MoviePairFnType = async (
  qClient,
  gameGenre,
  badImdbId,
) => {
  const queryKey = ['movieList', gameGenre];
  const movieList = qClient.getQueryData<MovieTypes[]>(queryKey);
  const moviePair = qClient.getQueryData<MoviePair>(['moviePair']);

  if (!movieList || !moviePair) throw new Error('No movie list or pair');

  let newMovie = movieList[randomIndex(movieList)];

  while (newMovie.imdbId === moviePair[1].imdbId)
    newMovie = movieList[randomIndex(movieList)];

  const outMoviePair = (movie: MovieTypes) =>
    movie.imdbId === newMovie.imdbId ? false : true;

  const newPair = moviePair;
  const newList = movieList.filter(outMoviePair);
  const movieIndex = moviePair.findIndex((movie) => movie.imdbId === badImdbId);

  if (movieIndex !== -1) newPair[movieIndex] = newMovie;

  return [newList, newPair, moviePair];
};
