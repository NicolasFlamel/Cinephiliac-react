import './styles.css'

const GameOver = ({ gameMode, gameGenre, score }) => {
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
        <div>
          <input className="username-input" type="text" placeholder="Name" />
          <button className="custom-btn" id="save-btn" type="button">
            Save
          </button>
        </div>
      </section>
    </div>
  );
};

export default GameOver;
