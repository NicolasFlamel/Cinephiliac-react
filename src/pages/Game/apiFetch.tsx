import { Movie, MovieDatabaseApiType, MovieDatabaseResultsType } from 'types';
import { getMovieFromDB, putMovieDataIntoDB } from 'utils/MovieDB';

interface FetchingMovieList {
  next?: string;
  signal: AbortSignal;
  gameGenre: string;
}

interface FetchingMovieStats {
  imdbId: string;
  signal: AbortSignal;
}

// fetch movie list from api
export const fetchMovieList = async ({
  next = '',
  signal,
  gameGenre,
}: FetchingMovieList): Promise<MovieDatabaseResultsType[]> => {
  console.log('Fetching Movie List');
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API!,
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
    },
  };
  // TODO: Url testing when api is back
  const url =
    'https://moviesdatabase.p.rapidapi.com' +
    (next
      ? next
      : '/titles?list=top_rated_english_250&startYear=2000' +
        (gameGenre !== 'All-Genres' ? `&genre=${gameGenre}` : ''));

  const response = await fetch(url, { ...options, signal });
  const data: MovieDatabaseApiType = await response.json();
  const resultsList = [...data.results];
  const nextData = data.next
    ? await fetchMovieList({ next: data.next, signal, gameGenre })
    : [];
  const fullList = resultsList.concat(nextData);

  return fullList;
};

// fetch movie list from api
export const fetchMovieStats = async ({
  imdbId,
  signal,
}: FetchingMovieStats) => {
  const movie = await getMovieFromDB(imdbId);

  if (movie?.title) return movie;

  console.log('Fetching Stats');

  const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.REACT_APP_OMDB_Key}`;
  const response = await fetch(omdbUrl, { signal });
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
