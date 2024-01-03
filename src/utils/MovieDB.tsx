import Dexie, { type Table } from 'dexie';

interface Movies {
  imdbId: string;
  genre?: Array<string>;
  title?: string;
  boxOffice?: string;
  rating?: string;
  posterUrl?: string;
}

class MySubClassedDexie extends Dexie {
  movies!: Table<Movies>;

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

export const addMoviesToDB = async (
  movieList: Array<Movies>,
  genre: string,
) => {
  const movieListFormatted = movieList.map((movie) => ({
    ...movie,
    genre: [genre],
  }));
  const idList = movieListFormatted.map((movie) => movie.imdbId);

  try {
    const movieFound = await db.movies.where('imdbId').anyOf(idList).toArray();

    if (movieFound.length) {
      await db.movies
        .where('imdbId')
        .anyOf(idList)
        .modify((dbMovie) => {
          if (!dbMovie.genre) console.error('No Genre object');
          else {
            !dbMovie.genre.includes(genre);
            dbMovie.genre = [...dbMovie.genre, genre];
          }
        });
    }

    const missingMovies = movieListFormatted.filter((movieL) => {
      const duplicate = movieFound.some(
        (movieF) => movieF.imdbId === movieL.imdbId,
      );
      return !duplicate;
    });

    await db.movies.bulkAdd(missingMovies);
  } catch (error) {
    console.error('Failed to add movie', error);
  }
};

export const putMovieDataIntoDB = async ({
  imdbId,
  title,
  boxOffice,
  posterUrl,
  rating,
}: Movies) => {
  return await db.movies.update(imdbId, {
    title,
    boxOffice,
    rating,
    posterUrl,
  });
};

export const getMovieListFromDB = async (genre: string) => {
  return db.movies.where('genre').equals(genre).toArray();
};

export const getMovieFromDB = async (imdbId: string) => {
  return db.movies.get(imdbId);
};

export const removeMovieFromDB = async (imdbId: string) => {
  return db.movies.delete(imdbId);
};
