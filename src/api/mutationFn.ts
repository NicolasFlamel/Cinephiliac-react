import { QueryClient } from '@tanstack/react-query';
import { GameGenreType, Movie, MovieTypes } from 'types';
import { randomIndex } from './helpers';

export const movieListFn = async (
  qClient: QueryClient,
  gameGenre: GameGenreType,
): Promise<[Movie[], [Movie, Movie]]> => {
  const movieList = qClient.getQueryData<Movie[]>(['movieList', gameGenre]);
  const moviePair = qClient.getQueryData<[MovieTypes, MovieTypes]>([
    'moviePair',
  ]);

  if (!movieList || !moviePair) throw new Error('No movie list or pair');

  let newMovie = movieList[randomIndex(movieList)];

  while (newMovie.imdbId === moviePair[1].imdbId)
    newMovie = movieList[randomIndex(movieList)];

  const newList = movieList.filter((movie) =>
    movie.imdbId === moviePair[0].imdbId ||
    movie.imdbId === moviePair[0].imdbId ||
    movie.imdbId === newMovie.imdbId
      ? false
      : true,
  );
  const newPair: [Movie, Movie] = [moviePair[1], newMovie];

  return [newList, newPair];
};
