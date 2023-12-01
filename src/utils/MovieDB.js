import Dexie from 'dexie';

const db = new Dexie('CinephiliacDB');

db.version(1).stores({
  movies: 'imdbId, *genre', // Primary key and indexed props
});

export const addMovies = async (movieList, genre) => {
  const movieListFormatted = movieList.map((movie) => ({
    imdbId: movie.id,
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

export const updateMovie = async (id, data) => {
  console.log(data.genre);
  const movie = await db.movies.get(id);

  if (movie.genre.length) {
    // const genreList =
  }
  data.genre = movie.genre ? [...data.genre, ...movie.genre] : data.genre;
  return await db.movies.update(id, data);

  // return db.movies.update(id, data); // return promise
};

export const getMovieList = async (genre) => {
  return db.movies.where('genre').equals(genre).toArray();
};

// addMovies({
//   title: "The King's Speech",
//   imdbId: 'tt1504320',
//   genre: ['all']
// });

// updateMovie('tt1504320', {
//   genre: ['all'],
//   boxOffice: '$138,797,499',
//   score: 88,
// });

// getMovieList('all');
