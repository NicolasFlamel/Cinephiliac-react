import Dexie, { type Table } from 'dexie';
import {
  GameGenreType,
  MovieIndexedDB,
  MovieDBWithStats,
  MovieWithStats,
  MovieTypes,
  MovieDBWithoutStats,
} from 'types';

class MySubClassedDexie extends Dexie {
  movies!: Table<MovieIndexedDB | MovieDBWithStats>;

  constructor() {
    super('CinephiliacDB');
    this.version(1).stores({
      movies: 'imdbId, *genre',
    });
  }
}

const db = new MySubClassedDexie();

db.version(1).stores({
  movies: 'imdbId, *genre', // Primary key and indexed props
});

type AddMovieToDBType = (a: Array<MovieTypes>, b: GameGenreType) => void;
export const addMoviesToDB: AddMovieToDBType = async (movieList, genre) => {
  const uniqueMovieList = getUniqueMovieList(movieList);
  const movieListFormatted = uniqueMovieList.map<MovieDBWithoutStats>(
    (movie) => ({
      ...movie,
      genre: [genre],
    }),
  );
  const idList = movieListFormatted.map((movie) => movie.imdbId);

  try {
    const moviesFoundInDB = await db.movies
      .where('imdbId')
      .anyOf(idList)
      .toArray();

    if (moviesFoundInDB.length) {
      // updated already saved movies
      await db.movies
        .where('imdbId')
        .anyOf(idList)
        .modify((dbMovie) => {
          if (!dbMovie.genre) console.error('No Genre object');
          else if (!dbMovie.genre.includes(genre)) {
            dbMovie.genre = [...dbMovie.genre, genre];
          }
        });
    }

    // added remaining movies
    const missingMovies = movieListFormatted.filter((movieL) => {
      const duplicate = moviesFoundInDB.some(
        (movieF) => movieF.imdbId === movieL.imdbId,
      );
      return !duplicate;
    });

    await db.movies.bulkAdd(missingMovies);
  } catch (error) {
    console.error('Failed to add movie', error);
  }
};

export const putMovieDataIntoDB = async (movieStats: MovieWithStats) => {
  const { imdbId, ...stats } = movieStats;

  return await db.movies.update(imdbId, stats);
};

export const getMovieListFromDB = async (genre: GameGenreType) => {
  return db.movies.where('genre').equals(genre).toArray();
};

export const getMovieFromDB = async (imdbId: string) => {
  const dbMovie = await db.movies.get(imdbId);

  return dbMovie;
};

export const removeMovieFromDB = async (imdbId: string) => {
  return db.movies.delete(imdbId);
};

// remove duplicates from MovieTypes[]
const getUniqueMovieList = (normalList: MovieTypes[]): MovieTypes[] => {
  const uniqueList = normalList.reduce<MovieTypes[]>((movieList, movie) => {
    const hasMovie = movieList.some(
      (someMovie) => someMovie.imdbId === movie.imdbId,
    );

    if (hasMovie) return movieList;

    movieList.push(movie);
    return movieList;
  }, []);

  return uniqueList;
};
