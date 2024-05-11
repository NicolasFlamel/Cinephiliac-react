import {
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  GameGenreType,
  Movie,
  MovieList,
  MovieTypes,
  MovieWithStats,
} from 'types';
import { fetchMovieList, fetchMovieStats } from './queryFn';
import { movieListFn } from './mutationFn';
import { randomIndex } from './helpers';

type UseGetMovieListType = (
  gameGenre: GameGenreType,
) => [
  UseQueryResult<MovieList[], Error>,
  UseQueryResult<[MovieTypes, MovieTypes], Error>,
  UseQueryResult<MovieWithStats, Error>[],
];
export const useGetMovieList: UseGetMovieListType = (gameGenre) => {
  const listQuery = useQuery({
    queryKey: ['movieList', gameGenre],
    queryFn: () => fetchMovieList(gameGenre),
  });

  const movieList = listQuery?.data;

  const pairQuery = useQuery({
    queryKey: ['moviePair'],
    queryFn: async (): Promise<[MovieTypes, MovieTypes]> => {
      if (!movieList) throw new Error('no movie list');
      const firstIndex = randomIndex(movieList);
      let secondIndex = randomIndex(movieList);

      while (firstIndex === secondIndex) secondIndex = randomIndex(movieList);

      return [movieList[firstIndex], movieList[secondIndex]];
    },
    enabled: !!movieList,
  });

  const moviePair = pairQuery.data;

  const statsQueries = useQueries({
    queries: moviePair
      ? moviePair.map((movie) => ({
          queryKey: ['movieStats', movie.imdbId],
          queryFn: () => fetchMovieStats(movie.imdbId),
        }))
      : [],
  });

  return [listQuery, pairQuery, statsQueries];
};

export const useMutateMovieList = (gameGenre: GameGenreType) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => movieListFn(qClient, gameGenre),
    onSuccess: ([newList, newPair]: [Movie[], [Movie, Movie]]) => {
      qClient.setQueryData<Movie[]>(['movieList', gameGenre], newList);
      qClient.setQueryData<[Movie, Movie]>(['moviePair'], newPair);
    },
    onError: (error) => console.error(error),
  });

  return mutation;
};
