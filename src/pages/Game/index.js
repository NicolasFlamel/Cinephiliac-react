import './styles.css';
import { useEffect, useState } from 'react';
import Movie from '../../components/Movie';
import { addMovies, putMovieData } from '../../utils/MovieDB';

const Game = ({ gameMode, gameGenre, score }) => {
  const [movieList, setMovieList] = useState(
    JSON.parse(localStorage.getItem(`${gameGenre}`)) || [],
  );
  const [comparedMovies, setComparedMovies] = useState([]);
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RapidAPI,
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
    },
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (!movieList.length) {
      fetchMovieList(null, signal).then(storeMovieList).catch(console.error);
    }
    score.current = 0;
    // console.log('score', score.current);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const [movieOneStats, movieTwoStats] = await Promise.all([
        fetchMovieStats(comparedMovies[0].id, signal),
        fetchMovieStats(comparedMovies[1].id, signal),
      ]);

      putMovieData(movieOneStats);
      putMovieData(movieTwoStats);

      // store data & account for no stats on box office
      setComparedMovies((prevState) => {
        const movieOne = {
          ...prevState[0],
          title: movieOneStats.Title,
          boxOffice: movieOneStats.BoxOffice,
          posterUrl: movieOneStats.Poster,
          imdbRating: movieOneStats.imdbRating,
        };
        const movieTwo = {
          ...prevState[1],
          title: movieTwoStats.Title,
          boxOffice: movieTwoStats.BoxOffice,
          posterUrl: movieTwoStats.Poster,
          imdbRating: movieTwoStats.imdbRating,
        };
        return [movieOne, movieTwo];
      });
    };

    if (
      comparedMovies.length &&
      !comparedMovies.every((movie) => movie.posterUrl)
    ) {
      fetchData().catch((err) => console.error(err));
    }

    return () => controller.abort();
  }, [comparedMovies]);

  // fetch movie list api
  const fetchMovieList = async (next, signal) => {
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
    const omdbUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=${process.env.REACT_APP_OMDB_Key}`;
    const response = await fetch(omdbUrl, { signal });
    const data = await response.json();
    return data;
  };

  const storeMovieList = (fetchedMovieList) => {
    localStorage.setItem(`${gameGenre}`, JSON.stringify(fetchedMovieList));
    addMovies(fetchedMovieList);
    setMovieList(fetchedMovieList);
  };

  const handleClick = ({ target }) => {
    const movieTwoIndex = Math.floor(Math.random() * (movieList.length - 1));

    if (!target.value) return;

    // compare movies
    target.value === '<' ? (score.current += 1) : (score.current -= 1);

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
        movie.id === movieList[movieTwoIndex].id ? false : true,
      ),
    );
  };

  // conditional rendering
  if (movieList.length === 1) return <h2>Out of Movies!</h2>;
  else if (movieList.length === 0) return <h2>Fetching Data...</h2>;
  else if (comparedMovies.length === 0) {
    const ranMovieOne =
      movieList[Math.floor(Math.random() * (movieList.length - 1))];
    const ranMovieTwo =
      movieList[Math.floor(Math.random() * (movieList.length - 1))];

    setComparedMovies([{ id: ranMovieOne.id }, { id: ranMovieTwo.id }]);
    setMovieList((prevState) =>
      prevState.filter((movie) =>
        movie.id === ranMovieOne.id || movie.id === ranMovieTwo.id
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
            <article key={movie.id} className="movie-card">
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
          <div className="ui buttons" onClick={handleClick}>
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
