import './styles.css';
import { useRef, useState } from 'react';

const GameOver = ({ gameMode, gameGenre, score }) => {
  const username = useRef('');
  const savedScores = useRef(
    JSON.parse(localStorage.getItem('cinephiliacSB')) || [],
  );
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.current === '') return;

    const userScore = {
      gameMode,
      gameGenre,
      score: score.current,
      username: username.current,
    };

    savedScores.current.push(userScore);
    localStorage.setItem('cinephiliacSB', JSON.stringify(savedScores.current));

    setSaved(true);
  };

  return (
    <div className="game-over-page">
      <section id="score">
        {/* display results */}
        <h2>You're score was: {score.current}</h2>
        <h3>
          Game mode: {gameMode === 'Box-Office' ? 'Box Office' : 'Ratings'}
        </h3>
        <h3>Genre: {gameGenre === 'All-Genres' ? 'All Genres' : gameGenre}</h3>
      </section>
      <section id="user-info">
        {/* user inputs info for scoreboard */}
        <h2>Enter Player Name:</h2>
        <form className="user-form" onSubmit={handleSubmit}>
          <input
            className="username-input"
            type="text"
            placeholder="Name"
            name="username"
            onChange={(e) => (username.current = e.target.value)}
          />
          <button
            type="submit"
            id="save-btn"
            className="custom-btn"
            disabled={saved}
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
};

export default GameOver;
