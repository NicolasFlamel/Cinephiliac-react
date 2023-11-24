import { useEffect, useState } from 'react';
import './styles.css';
// testing purpose, remove later
import temp from './temp.json';

const Game = ({ gameType, gameGenre }) => {
  const [movieList, setMovieList] = useState(
    JSON.parse(localStorage.getItem(`${gameGenre}`)) || [],
  );
  // get movie data. maybe props or use components
  const firstMovie = { title: 'first' };
  const secondMovie = { title: 'second' };
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
      // const url =
      //   'https://moviesdatabase.p.rapidapi.com' +
      //   (next ? next : '/titles?startYear=2000&list=top_rated_english_250');

      // const response = await fetch(url, options);
      // const data = await response.json();
      // const movieList = [...data.results];
      // const fullData = data.next ? fetchData(data.next) : [];

      // return movieList.concat(fullData);
      console.log('fetch', temp);
      localStorage.setItem(`${gameGenre}`, JSON.stringify(temp));
      setMovieList(temp);
      return temp;
    };

    if (!movieList.length) fetchData().catch(console.error);
  }, [gameType, gameGenre]);

  return (
    <section id="game-section">
      <section id="question">
        <em>{secondMovie.title}</em> has a higher or lower {gameType} amount
        than <em>{firstMovie.title}</em>?
      </section>
      <article id="movie-one"></article>
      <article id="movie-two"></article>
    </section>
  );
};

export default Game;
