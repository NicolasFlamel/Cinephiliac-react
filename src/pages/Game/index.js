import './styles.css';
import { useEffect, useState } from 'react';
import Movie from '../../components/Movie';

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
    if (!movieList.length) {
      fetchMovieList().then(storeMovieList).catch(console.error);
    }
    score.current = 0;
    console.log('score', score.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch movie list api
  const fetchMovieList = async (next) => {
    const url =
      'https://moviesdatabase.p.rapidapi.com' +
      (next ? next : '/titles?startYear=2000&list=top_rated_english_250');

    const response = await fetch(url, options);
    const data = await response.json();
    const resultsList = [...data.results];
    const nextData = data.next ? await fetchMovieList(data.next) : [];
    const fullList = resultsList.concat(nextData);

    return fullList;
  };

  const storeMovieList = (fetchedMovieList) => {
    localStorage.setItem(`${gameGenre}`, JSON.stringify(fetchedMovieList));
    setMovieList(fetchedMovieList);
  };

  const handleClick = ({ target }) => {
    if (!target.value) return;

    // compare movies
    target.value === '<' ? (score.current += 1) : (score.current -= 1);

    // movie second movie to first and set new second movie
    setComparedMovies((prevState) => {
      const movieOne = { ...prevState[1] };
      const movieTwo =
        movieList[Math.floor(Math.random() * (movieList.length - 1))];
      return [movieOne, movieTwo];
    });

    // remove selected movies already
    setMovieList((prevState) =>
      prevState.filter((movie) =>
        movie.id === comparedMovies[0].id || movie.id === comparedMovies[1].id
          ? false
          : true,
      ),
    );
  };

  // conditional rendering
  if (movieList.length === 0) {
    return <h2>Fetching Data...</h2>;
  } else if (comparedMovies.length === 0) {
    const ranIndexOne = Math.floor(Math.random() * (movieList.length - 1));
    const ranIndexTwo = Math.floor(Math.random() * (movieList.length - 1));

    setComparedMovies([movieList[ranIndexOne], movieList[ranIndexTwo]]);
    return <h2>Loading Movies...</h2>;
  }

  return (
    <section id="game-section">
      <section id="question">
        <h2>
          <em>{comparedMovies[1].originalTitleText.text}</em> has a higher or
          lower {gameMode} amount than{' '}
          <em>{comparedMovies[0].originalTitleText.text}</em>?
        </h2>
      </section>

      <section className="game">
        {comparedMovies.map((movie, index) => {
          return (
            <article key={movie.id} className="movie-card">
              <h2 className="game-option">
                {gameMode + ': ' + (index === 0 ? '####' : '???')}
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
