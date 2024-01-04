import './styles.css';
import { Movie } from '../../types';
import { MutableRefObject, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import {
  addMoviesToDB,
  getMovieListFromDB,
  removeMovieFromDB,
} from '../../utils/MovieDB';
import { fetchMovieList, fetchMovieStats } from './apiFetch';

interface GameProps {
  gameMode: string;
  gameGenre: string;
  score: MutableRefObject<number>;
}

const Game = ({ gameMode, gameGenre, score }: GameProps) => {
  const [movieList, setMovieList] = useState<Array<Movie>>([]);
  const [comparedMovies, setComparedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // on mount getMovieList
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getMovieListDB = async () => {
      const randomIndex = () => Math.floor(Math.random() * movieListDB.length);
      let movieListDB = await getMovieListFromDB(gameGenre);

      if (!movieListDB.length) {
        const fetchedMovieList = await fetchMovieList({
          signal,
          gameGenre,
        }).catch((error: any) =>
          error instanceof DOMException
            ? null
            : console.error('fetchMovieList', error),
        );

        if (!fetchedMovieList) return;

        movieListDB = fetchedMovieList.map((movie: { id: string }) => ({
          imdbId: movie.id,
        }));

        addMoviesToDB(movieListDB, gameGenre);
      }

      const ranMovieOne = movieListDB[randomIndex()];
      let ranMovieTwo = movieListDB[randomIndex()];

      while (ranMovieOne.imdbId === ranMovieTwo.imdbId)
        ranMovieTwo = movieListDB[randomIndex()];

      setComparedMovies([ranMovieOne, ranMovieTwo]);

      setMovieList(
        movieListDB.filter((movie) =>
          movie.imdbId === ranMovieOne.imdbId ||
          movie.imdbId === ranMovieTwo.imdbId
            ? false
            : true,
        ),
      );
    };

    score.current = 0;

    getMovieListDB();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch rest of movieStats when movie changes
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (comparedMovies?.length !== 2) return setIsLoading(true);
      else if (!comparedMovies?.every((movie) => movie.posterUrl))
        return setIsLoading(false);

      setIsLoading(true);

      const [movieOneStats, movieTwoStats] = await Promise.all([
        fetchMovieStats({ imdbId: comparedMovies[0].imdbId, signal }),
        fetchMovieStats({ imdbId: comparedMovies[1].imdbId, signal }),
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
          ...prevState![0],
          title: movieOneStats.title,
          boxOffice: movieOneStats.boxOffice,
          posterUrl: movieOneStats.posterUrl,
          imdbRating: movieOneStats.rating,
        };
        const movieTwo = {
          ...prevState![1],
          title: movieTwoStats.title,
          boxOffice: movieTwoStats.boxOffice,
          posterUrl: movieTwoStats.posterUrl,
          imdbRating: movieTwoStats.rating,
        };
        return [movieOne, movieTwo];
      });
    };

    fetchData().catch((err) =>
      err instanceof DOMException ? null : console.error('fetchData', err),
    );

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieList, comparedMovies]);

  const nextMovie = () => {
    const randomMovieIndex = Math.floor(Math.random() * (movieList.length - 1));

    // if we run out of movies
    if (movieList.length === 1) return;

    // moves second movie to first and set new second movie
    setComparedMovies((prevState) => [
      { ...prevState![1] },
      movieList[randomMovieIndex],
    ]);

    // remove selected movies already
    removeMovieFromState(movieList[randomMovieIndex].imdbId);
  };

  const removeMovie = async (imdbId: string) => {
    const randomMovie =
      movieList[Math.floor(Math.random() * (movieList.length - 1))];

    removeMovieFromState(imdbId);

    setComparedMovies((prevState) => [
      ...prevState!.map((movie) =>
        movie.imdbId === imdbId ? randomMovie : movie,
      ),
    ]);

    removeMovieFromDB(imdbId);
  };

  const removeMovieFromState = (imdbId: string) => {
    setMovieList((prevState) =>
      prevState.filter((movie) => movie.imdbId !== imdbId),
    );
  };

  const compareMovies = (choice: '>' | '<') => {
    const compareFunction = {
      '>': (x: number, y: number) => {
        return x > y;
      },
      '<': (x: number, y: number) => {
        return x < y;
      },
    };

    if (!comparedMovies) return console.error('No comparedMovies to compare');

    const [movieOneStat, movieTwoStat] = comparedMovies.map((movie) => {
      if (gameMode === 'Box-Office' && movie.boxOffice) {
        return Number(movie.boxOffice.match(/\d+/g)?.join(''));
      } else if (gameMode === 'Box-Office' && movie.rating) {
        return Number(movie.rating);
      } else {
        console.error(`Error in compareMovies() with genre ${gameMode}`);
        return -1;
      }
    });

    return compareFunction[choice](movieTwoStat, movieOneStat);
  };

  const handleAnswerClick = (userInput: '>' | '<') => {
    setIsLoading(true);

    const correct = compareMovies(userInput);

    if (!correct) return navigate('/game-over');

    score.current++;
    nextMovie();
  };

  // conditional rendering
  if (movieList.length === 1) return <h2>Out of Movies!</h2>;
  else if (movieList.length === 0)
    return <h2 className="loading">Fetching Data...</h2>;
  else if (comparedMovies.length === 0)
    return <h2 className="loading">Loading Movies...</h2>;

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
                  (index === 0
                    ? gameMode === 'Box-Office'
                      ? movie.boxOffice
                      : movie.rating || 'Loading'
                    : '???')}
              </h2>
              <MovieCard movieData={movie} />
            </article>
          );
        })}
        <section id="higher-lower-btns">
          <div className="buttons">
            <button
              type="button"
              className="custom-btn"
              disabled={isLoading}
              onClick={() => handleAnswerClick('>')}
            >
              Higher
            </button>

            <div className="or"></div>

            <button
              type="button"
              value="<"
              className="custom-btn"
              disabled={isLoading}
              onClick={() => handleAnswerClick('<')}
            >
              Lower
            </button>
          </div>
        </section>
      </section>
    </section>
  );
};

export default Game;
