import { QueryClient } from '@tanstack/react-query';
import { GameGenreType, MoviePair, MovieTypes } from 'types';
import { randomIndex } from './helpers';

// Fn for mutation when getting next movie in pair
export const movieListFn = async (
  qClient: QueryClient,
  gameGenre: GameGenreType,
) => {
  const queryKey = ['movieList', gameGenre];
  const movieList = qClient.getQueryData<MovieTypes[]>(queryKey);
  const moviePair = qClient.getQueryData<MoviePair>(['moviePair', gameGenre]);

  if (!movieList || !moviePair) throw new Error('No movie list or pair');

  const newMovie = movieList[randomIndex(movieList)];
  const newPair: MoviePair = [moviePair[1], newMovie];

  return newPair;
};

// Fn for mutation when movie doesn't have stat
export const moviePairFn = async (
  qClient: QueryClient,
  gameGenre: GameGenreType,
  badImdbId: string,
) => {
  const queryKey = ['movieList', gameGenre];
  const movieList = qClient.getQueryData<MovieTypes[]>(queryKey);
  const moviePair = qClient.getQueryData<MoviePair>(['moviePair', gameGenre]);

  if (!movieList || !moviePair) throw new Error('No movie list or pair');

  const newMovie = movieList[randomIndex(movieList)];

  const outMoviePair = (movie: MovieTypes) =>
    movie.imdbId === newMovie.imdbId ? false : true;

  const newPair = moviePair;
  const newList = movieList.filter(outMoviePair);
  const movieIndex = moviePair.findIndex((movie) => movie.imdbId === badImdbId);

  if (movieIndex !== -1) newPair[movieIndex] = newMovie;

  const data: [MovieTypes[], MoviePair] = [newList, newPair];

  return data;
};

export const removePairFn = async (
  qClient: QueryClient,
  gameGenre: GameGenreType,
) => {
  const listQueryKey = ['movieList', gameGenre];
  const pairQueryKey = ['moviePair', gameGenre];
  const movieList = qClient.getQueryData<MovieTypes[]>(listQueryKey);
  const moviePair = qClient.getQueryData<MoviePair>(pairQueryKey);

  if (!movieList || !moviePair) throw new Error('Yikes');

  const newList = movieList.filter((movie) => {
    if (movie.imdbId === moviePair[0].imdbId) return false;
    else if (movie.imdbId === moviePair[1].imdbId) return false;
    else return true;
  });

  return newList;
};
