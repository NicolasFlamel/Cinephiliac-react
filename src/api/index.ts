import {
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  GameGenreType,
  MovieList,
  MoviePair,
  MovieTypes,
  MovieWithStats,
} from 'types';
import { fetchMovieList, fetchMovieStats } from './queryFn';
import { movieListFn, moviePairFn } from './mutationFn';
import { randomIndex } from './helpers';

type UseGetMovieListType = (
  gameGenre: GameGenreType,
) => [
  UseQueryResult<MovieList[], Error>,
  UseQueryResult<MoviePair, Error>,
  UseQueryResult<MovieWithStats, Error>[],
];
export const useGetMovieList: UseGetMovieListType = (gameGenre) => {
  const listQuery = useQuery({
    queryKey: ['movieList', gameGenre],
    queryFn: () => fetchMovieList(gameGenre),
    refetchOnWindowFocus: false,
  });

  const movieList = listQuery?.data;

  const pairQuery = useQuery<MoviePair>({
    queryKey: ['moviePair'],
    queryFn: async (): Promise<MoviePair> => {
      if (!movieList) throw new Error('no movie list');
      const firstIndex = randomIndex(movieList);
      let secondIndex = randomIndex(movieList);

      while (firstIndex === secondIndex) secondIndex = randomIndex(movieList);

      return [movieList[firstIndex], movieList[secondIndex]];
    },
    enabled: !!movieList,
    refetchOnWindowFocus: false,
  });

  const moviePair = pairQuery.data;

  const statsQueries = useQueries<UseQueryOptions<MovieWithStats>[]>({
    queries: moviePair
      ? moviePair.map((movie) => ({
          queryKey: ['movieStats', movie.imdbId],
          queryFn: () => fetchMovieStats(movie.imdbId),
          refetchOnWindowFocus: false,
          retry: false,
        }))
      : [],
  });

  return [listQuery, pairQuery, statsQueries];
};

// mutate list and get new pair when answering correct
export const useMutateMovieList = (gameGenre: GameGenreType) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => movieListFn(qClient, gameGenre),
    onSuccess: ([newList, newPair]: [MovieTypes[], MoviePair]) => {
      qClient.setQueryData<MovieTypes[]>(['movieList', gameGenre], newList);
      qClient.setQueryData<MoviePair>(['moviePair'], newPair);
    },
    onError: (error) => console.error(error),
  });

  return mutation;
};

// mutate pair when one fails
export const useMutateMoviePair = (gameGenre: GameGenreType) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (imdbId: string) =>
      moviePairFn(qClient, gameGenre, imdbId),
    onSuccess: ([newList, newPair, oldPair]: [
      MovieTypes[],
      MoviePair,
      MoviePair,
    ]) => {
      qClient.setQueryData<MovieTypes[]>(['movieList', gameGenre], newList);
      qClient.setQueryData<MoviePair>(['moviePair'], newPair);
    },
    onError: (error) => console.error(error),
  });

  return mutation;
};
