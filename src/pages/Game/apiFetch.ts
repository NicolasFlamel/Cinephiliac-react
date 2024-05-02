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
  MovieDatabaseApiType,
  MovieIndexedDB,
  MovieList,
  MovieTypes,
  MovieWithStats,
} from 'types';
import {
  addMoviesToDB,
  getMovieFromDB,
  getMovieListFromDB,
  putMovieDataIntoDB,
} from 'utils/MovieDB';

export const randomIndex = (list: any[]) =>
  Math.floor(Math.random() * list.length);

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
    mutationFn: async (): Promise<[Movie[], [Movie, Movie]]> => {
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
    },
    onSuccess: ([newList, newPair]: [Movie[], [Movie, Movie]]) => {
      qClient.setQueryData<Movie[]>(['movieList', gameGenre], newList);
      qClient.setQueryData<[Movie, Movie]>(['moviePair'], newPair);
    },
    onError: (error) => console.error(error),
  });

  return mutation;
};

type FetchMovieList = (
  gameGenre: GameGenreType,
  next?: string,
) => Promise<Movie[] | MovieIndexedDB[]>;
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
  const resultsList: Movie[] = data.results.map((movie) => ({
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

  if (!response.ok) throw new Error('Movie stats fetch response was not ok');

  const data = await response.json();
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
