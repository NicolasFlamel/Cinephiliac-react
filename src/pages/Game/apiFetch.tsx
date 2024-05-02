import {
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Movie } from 'types';
import { getMovieFromDB, putMovieDataIntoDB } from 'utils/MovieDB';

type QueryKeyType = [string, string, string?];

type fetchMovieListType = ({
  queryKey: [_key, gameGenre, next],
}: {
  queryKey: QueryKeyType;
}) => Promise<Movie[]>;

let db: IDBDatabase;
const request = indexedDB.open('CinephiliacDB');

request.onerror = () => {
  console.error("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = () => {
  console.log('connected');
  db = request.result;
};

export const randomIndex = (list: any[]) =>
  Math.floor(Math.random() * list.length);

type UseGetMovieListType = (
  gameGenre: string,
) => [
  UseQueryResult<Movie[], Error>,
  UseQueryResult<[Movie, Movie], Error>,
  UseQueryResult<Movie, Error>[],
];
export const useGetMovieList: UseGetMovieListType = (gameGenre) => {
  const listQuery = useQuery({
    queryKey: ['movieList', gameGenre],
    queryFn: fetchMovieList,
  });

  const movieList = listQuery?.data;

  const pairQuery = useQuery({
    queryKey: ['moviePair'],
    queryFn: async (): Promise<[Movie, Movie]> => {
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

// type UseMutateMovieListReturn = [
//   React.MutableRefObject<[string, string] | undefined>,
//   UseMutationResult<Movie[], Error, void, unknown>,
// ];
// type UseMutateMovieListType = (gameGenre: string) => UseMutateMovieListReturn;
export const useMutateMovieList = (gameGenre: string) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (): Promise<[Movie[], [Movie, Movie]]> => {
      const movieList = qClient.getQueryData<Movie[]>(['movieList', gameGenre]);
      const moviePair = qClient.getQueryData<[Movie, Movie]>(['moviePair']);

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

// fetch movie list from api
export const fetchMovieList: fetchMovieListType = async ({ queryKey }) => {
  await new Promise((res) => {
    const interval = setInterval((): any => {
      if (!db) return;
      res(true);
      clearInterval(interval);
    }, 1000);
  });

  if (!db) return [];

  const things = await new Promise<Movie[]>((resolve, reject) => {
    const transaction = db.transaction(['movies']);
    const objectStore = transaction.objectStore('movies');
    const request = objectStore.getAll();
    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });

  return things;

  // const [_key, gameGenre, next] = queryKey;
  // console.log('Fetching Movie List', _key);
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API!,
  //     'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
  //   },
  // };
  // const url =
  //   'https://moviesdatabase.p.rapidapi.com' +
  //   (next
  //     ? next
  //     : '/titles?list=top_rated_english_250&startYear=2000' +
  //       (gameGenre !== 'All-Genres' ? `&genre=${gameGenre}` : ''));

  // const response = await fetch(url, { ...options });

  // if (!response.ok) throw new Error('Movie list fetch response was not ok');

  // const data: MovieDatabaseApiType = await response.json();
  // const resultsList = [...data.results];

  // if (!data.next) return resultsList;

  // const nextQueryKey: QueryKeyType = [_key, gameGenre, data.next];

  // const nextData = await fetchMovieList({ queryKey: nextQueryKey });
  // const fullList = resultsList.concat(nextData);

  // if(Number(data.page) === 1) addMoviesToDB(fullList, gameGenre)

  // return fullList;
};

// fetch movie list from api
export const fetchMovieStats = async (imdbId: string) => {
  const movie = await getMovieFromDB(imdbId);

  if (movie?.title) return movie;

  const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.REACT_APP_OMDB_Key}`;
  const response = await fetch(omdbUrl);

  if (!response.ok) throw new Error('Movie stats fetch response was not ok');

  const data = await response.json();
  const movieStats: Movie = {
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
