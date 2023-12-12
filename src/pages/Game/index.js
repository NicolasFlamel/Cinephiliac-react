import './styles.css';
import { useEffect, useState } from 'react';
import Movie from '../../components/Movie';
import {
  addMoviesFromDB,
  getMovieFromDB,
  getMovieListFromDB,
  putMovieDataIntoDB,
  removeMovieFromDB,
} from '../../utils/MovieDB';
import { useNavigate } from 'react-router-dom';

const Game = ({ gameMode, gameGenre, score }) => {
  const [movieList, setMovieList] = useState([]);
  const [comparedMovies, setComparedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getMovieListDB = async () => {
      const movieListDB = await getMovieListFromDB(gameGenre);

      !movieListDB.length
        ? fetchMovieList(null, signal).then(storeMovieList).catch(console.error)
        : setMovieList(movieListDB);
    };

    score.current = 0;

    getMovieListDB();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const [movieOneStats, movieTwoStats] = await Promise.all([
        fetchMovieStats(comparedMovies[0].imdbId, signal),
        fetchMovieStats(comparedMovies[1].imdbId, signal),
      ]);

      const removedMovie = [movieOneStats, movieTwoStats].map((movie) => {
        if (movie.boxOffice !== 'N/A') return false;

        removeMovie(movie.imdbId);
        return true;
      });

      if (removedMovie.includes(true)) return;

      // store data & account for no stats on box office
      setComparedMovies((prevState) => {
        const movieOne = {
          ...prevState[0],
          title: movieOneStats.title,
          boxOffice: movieOneStats.boxOffice,
          posterUrl: movieOneStats.posterUrl,
          imdbRating: movieOneStats.rating,
        };
        const movieTwo = {
          ...prevState[1],
          title: movieTwoStats.title,
          boxOffice: movieTwoStats.boxOffice,
          posterUrl: movieTwoStats.posterUrl,
          imdbRating: movieTwoStats.rating,
        };
        return [movieOne, movieTwo];
      });
    };

    if (
      comparedMovies.length === 2 &&
      !comparedMovies.every((movie) => movie.posterUrl)
    ) {
      fetchData().catch((err) => console.error(err));
    }

    return () => controller.abort();
  });

  // fetch movie list api
  const fetchMovieList = async (next, signal) => {
    console.log('Fetching Movie List');
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API,
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
      }
    };
    // TODO: Url testing when api is back
    const url =
      'https://moviesdatabase.p.rapidapi.com' +
      (next
        ? next
        : '/titles?startYear=2000&list=top_rated_english_250' +
          (gameGenre !== 'All-Genres' ? `&genre=${gameGenre})` : ''));

    const response = await fetch(url, { ...options, signal });
    const data = await response.json();
    const resultsList = [...data.results];
    const nextData = data.next ? await fetchMovieList(data.next) : [];
    const fullList = resultsList.concat(nextData);

    return fullList;
  };

  const fetchMovieStats = async (movieId, signal) => {
    const movie = await getMovieFromDB(movieId);

    if (movie.title) return movie;

    console.log('Fetching Stats');

    const omdbUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=${process.env.REACT_APP_OMDB_Key}`;
    const response = await fetch(omdbUrl, { signal });
    const data = await response.json();

    // stores in indexedDB
    putMovieDataIntoDB(data);

    return {
      imdbId: movieId,
      title: data.Title,
      boxOffice: data.BoxOffice,
      posterUrl: data.Poster,
      rating: data.imdbRating,
    };
  };

  const storeMovieList = (fetchedMovieList) => {
    const movieListFormatted = fetchedMovieList.map((movie) => ({
      imdbId: movie.id,
    }));
    addMoviesFromDB(movieListFormatted, gameGenre);
    setMovieList(movieListFormatted);
  };

  const nextMovie = () => {
    const movieTwoIndex = Math.floor(Math.random() * (movieList.length - 1));

    // if we run out of movies
    if (movieList.length === 1) return;

    // moves second movie to first and set new second movie
    setComparedMovies((prevState) => {
      const movieOne = { ...prevState[1] };
      const movieTwo = movieList[movieTwoIndex];
      return [movieOne, movieTwo];
    });

    // remove selected movies already
    setMovieList((prevState) =>
      prevState.filter((movie) =>
        movie.imdbId === movieList[movieTwoIndex].imdbId ? false : true,
      ),
    );
  };

  const removeMovie = async (imdbId) => {
    const randomMovie =
      movieList[Math.floor(Math.random() * (movieList.length - 1))];

    setMovieList((prevState) => [
      ...prevState.filter((movie) => movie.imdbId !== imdbId),
    ]);
    setComparedMovies((prevState) => [
      ...prevState.map((movie) =>
        movie.imdbId === imdbId ? randomMovie : movie,
      ),
    ]);
    await removeMovieFromDB(imdbId);
  };

  const compareMovies = (choice) => {
    const compareFunction = {
      '>': (x, y) => {
        return x > y;
      },
      '<': (x, y) => {
        return x < y;
      },
    };

    const [movieOneStat, movieTwoStat] = comparedMovies.map((movie) => {
      if (gameMode === 'Box-Office') {
        return Number(movie.boxOffice.match(/\d+/g).join(''));
      } else {
        return Number(movie.imdbRating);
      }
    });

    return compareFunction[choice](movieTwoStat, movieOneStat);
  };

  const handleAnswerClick = ({ target }) => {
    if (!target.value) return;

    const correct = compareMovies(target.value);

    if (!correct) return navigate('/game-over');

    score.current++;
    nextMovie();
  };

  // conditional rendering
  if (movieList.length === 1) return <h2>Out of Movies!</h2>;
  else if (movieList.length === 0) return <h2>Fetching Data...</h2>;
  else if (comparedMovies.length === 0) {
    const ranMovieOne = movieList[Math.floor(Math.random() * movieList.length)];
    let ranMovieTwo = movieList[Math.floor(Math.random() * movieList.length)];

    while (ranMovieOne.imdbId === ranMovieTwo.imdbId) {
      ranMovieTwo = movieList[Math.floor(Math.random() * movieList.length)];
    }

    setComparedMovies([ranMovieOne, ranMovieTwo]);
    setMovieList((prevState) =>
      prevState.filter((movie) =>
        movie.imdbId === ranMovieOne.imdbId ||
        movie.imdbId === ranMovieTwo.imdbId
          ? false
          : true,
      ),
    );
    return <h2>Loading Movies...</h2>;
  }

  return (
    <section id="game-section">
      <section id="question">
        <h2>
          <em>{comparedMovies[1].title}</em> has a higher or lower {gameMode}{' '}
          amount than <em>{comparedMovies[0].title}</em>?
        </h2>
      </section>

      <section className="game">
        {comparedMovies.map((movie, index) => {
          return (
            <article key={movie.imdbId} className="movie-card">
              <h2 className="game-option">
                {gameMode +
                  ': ' +
                  (index === 0 ? movie.boxOffice || 'Loading' : '???')}
              </h2>
              <Movie movieData={movie} />
            </article>
          );
        })}
        <section id="higher-lower-btns">
          <div className="ui buttons" onClick={handleAnswerClick}>
            <button type="button" value=">" className="ui button positive">
              Higher
            </button>

            <div className="or"></div>

            <button type="button" value="<" className="ui button negative">
              Lower
            </button>
          </div>
        </section>
      </section>
    </section>
  );
};

export default Game;
