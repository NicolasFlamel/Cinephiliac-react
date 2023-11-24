import { useEffect, useState } from 'react';
import './styles.css';
// testing purpose, remove later
import temp from './temp.json';
import Movie from '../../components/Movie';

const Game = ({ gameType, gameGenre }) => {
  const [movieList, setMovieList] = useState(
    JSON.parse(localStorage.getItem(`${gameGenre}`)) || [],
  );
  const [firstMovie, setFirstMovie] = useState(null);
  const [secondMovie, setSecondMovie] = useState(null);
  // get movie data. maybe props or use components
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RapidAPI,
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
    },
  };

  useEffect(() => {
    // fetch game api
    const fetchData = async (next) => {
      const url =
        'https://moviesdatabase.p.rapidapi.com' +
        (next ? next : '/titles?startYear=2000&list=top_rated_english_250');

      const response = await fetch(url, options);
      const data = await response.json();
      const resultsList = [...data.results];
      const nextData = data.next ? await fetchData(data.next) : [];
      const fullList = resultsList.concat(nextData);

      return fullList;
      // console.log('fetch', temp);
      // localStorage.setItem(`${gameGenre}`, JSON.stringify(temp));
      // setMovieList(temp);
      // return temp;
    };

    if (!movieList.length) {
      fetchData()
        .then((fetchedMovieList) => {
          localStorage.setItem(
            `${gameGenre}`,
            JSON.stringify(fetchedMovieList),
          );
          setMovieList(fetchedMovieList);
        })
        .catch(console.error);
    }
  }, [gameType, gameGenre]);

  if (movieList.length === 0) {
    return <h2>Fetching Data...</h2>;
  } else if (!firstMovie && !secondMovie) {
    setFirstMovie(
      movieList[Math.floor(Math.random() * (movieList.length - 1))],
    );
    setSecondMovie(
      movieList[Math.floor(Math.random() * (movieList.length - 1))],
    );

    return <h2>Loading Movies...</h2>;
  }

  return (
    <section id="game-section">
      <section id="question">
        <em>{secondMovie.originalTitleText.text}</em> has a higher or lower{' '}
        {gameType} amount than <em>{firstMovie.originalTitleText.text}</em>?
      </section>

      <section className="game">
        <article id="movie-one">
          <Movie movieData={firstMovie} />
        </article>

        <article id="movie-two">
          <Movie movieData={secondMovie} />
        </article>

        <section id="higher-lower-btns">
          <div className="ui buttons">
            <button type="button" value="higher" className="ui button positive">
              Higher
            </button>

            <div className="or"></div>

            <button type="button" value="lower" className="ui button negative">
              Lower
            </button>
          </div>
        </section>
      </section>
    </section>
  );
};

export default Game;
