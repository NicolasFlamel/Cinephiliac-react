import Dexie from 'dexie';

const db = new Dexie('CinephiliacDB');

db.version(1).stores({
  movies: 'imdbId, *genre', // Primary key and indexed props
});

export const addMoviesToDB = async (movieList, genre) => {
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
        .modify((movie) => {
          if (!movie.genre.includes(genre))
            movie.genre = [...movie.genre, genre];
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
  Title,
  imdbID: imdbId,
  BoxOffice,
  imdbRating,
  Poster,
}) => {
  return await db.movies.update(imdbId, {
    title: Title,
    boxOffice: BoxOffice,
    rating: imdbRating,
    posterUrl: Poster,
  });
};

export const getMovieListFromDB = async (genre) => {
  return db.movies.where('genre').equals(genre).toArray();
};

export const getMovieFromDB = async (imdbId) => {
  return db.movies.get(imdbId);
};

export const removeMovieFromDB = async (imdbId) => {
  return db.movies.delete(imdbId);
};
