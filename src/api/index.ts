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
import { fetchMovieList, fetchMovieStats, getMoviePairFn } from './queryFn';
import { movieListFn, moviePairFn, removePairFn } from './mutationFn';

type UseGetMovieListType = (
  gameGenre: GameGenreType,
) => [
  UseQueryResult<MovieList[], Error>,
  UseQueryResult<MoviePair, Error>,
  UseQueryResult<MovieWithStats, Error>[],
];
// chain of queries to get movie list, pair and stats
export const useGetMovieList: UseGetMovieListType = (gameGenre) => {
  const listQuery = useQuery({
    queryKey: ['movieList', gameGenre],
    queryFn: () => fetchMovieList(gameGenre),
    refetchOnWindowFocus: false,
  });

  const movieList = listQuery?.data;

  const pairQuery = useQuery<MoviePair>({
    queryKey: ['moviePair', gameGenre],
    queryFn: () => getMoviePairFn(movieList),
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
export const useMutateNextMovie = (gameGenre: GameGenreType) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => movieListFn(qClient, gameGenre),
    onSuccess: (newPair: MoviePair) => {
      qClient.setQueryData<MoviePair>(['moviePair', gameGenre], newPair);
    },
    onError: (error) => console.error(error),
  });

  return mutation;
};

// mutate pair when one fails
export const useMutateMoviePair = (gameGenre: GameGenreType) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (imdbId: string) => moviePairFn(qClient, gameGenre, imdbId),
    onSuccess: ([newList, newPair]: [MovieTypes[], MoviePair]) => {
      qClient.setQueryData<MovieTypes[]>(['movieList', gameGenre], newList);
      qClient.setQueryData<MoviePair>(['moviePair'], newPair);
    },
    onError: (error) => console.error(error),
  });

  return mutation;
};

// removes pair from movie list
export const useMutateRemovePair = (gameGenre: GameGenreType) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => removePairFn(qClient, gameGenre),
    onSuccess: (newList) => {
      const queryKey = ['movieList', gameGenre];
      qClient.setQueryData<MovieTypes[]>(queryKey, newList);
    },
    onError: (err) => console.error(err),
  });

  return mutation;
};
