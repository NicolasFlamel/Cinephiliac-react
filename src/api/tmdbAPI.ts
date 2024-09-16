import { GameGenreType, TMDBApi, TMDBExternalIds, TMDBMovieData } from 'types';
import { tmdbGenres } from './data';

const movieDBKey = import.meta.env.VITE_TMDB_ACCESS_KEY;
if (!movieDBKey) throw new Error('No movieDB key');

export const fetchMovies = async (
  genre: GameGenreType,
  { signal }: RequestInit,
) => {
  const fetches = getMovieFetches(genre, { signal });

  const responses = await Promise.all(fetches);

  if (!responses.every((response) => response.ok)) {
    responses.forEach((response) =>
      response.ok ? null : console.error(response),
    );
    throw new Error('Movie list fetch response was not ok');
  }

  const apiData: TMDBApi[] = await Promise.all(
    responses.map((response) => response.json()),
  );
  const dataNoIMDB: TMDBMovieData[] = apiData.map((api) => api.results).flat();

  return dataNoIMDB;
};

type getMovieListType = (
  movieList: TMDBMovieData[],
  { signal }: RequestInit,
) => Promise<TMDBExternalIds>[];
export const getExternalIds: getMovieListType = (movieList, { signal }) => {
  const fetches = movieList.map(async (movie) => {
    const movieIdResponse = await fetchId(movie.id, { signal });

    if (!movieIdResponse.ok) throw new Error('Could not fetch movie id');

    const movieId: TMDBExternalIds = await movieIdResponse.json();

    return movieId;
  });

  return fetches;
};

export const fetchId = (id: number, { signal }: RequestInit) => {
  const url = `https://api.themoviedb.org/3/movie/${id}/external_ids`;

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + movieDBKey,
    },
    signal,
  };

  return fetch(url, fetchOptions);
};

const getMovieFetches = (genre: GameGenreType, { signal }: RequestInit) => {
  const amountOfPages = 5;

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + movieDBKey,
    },
    signal,
  };
  const url =
    'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&language=en-US&with_origin_country=US' +
    (genre === 'All-Genres' ? '' : `&with_genres=${convertGenre(genre)}`);

  const fetches: Promise<Response>[] = [];

  for (let i = 0; i < amountOfPages; i++) {
    fetches.push(fetch(url + `&page=${i + 1}`, fetchOptions));
  }

  return fetches;
};

const convertGenre = (genreToFind: GameGenreType) => {
  const genreObject = tmdbGenres.find((genre) => genre.name === genreToFind);

  if (!genreObject) throw new Error('!genreObject');

  return genreObject.id;
};
