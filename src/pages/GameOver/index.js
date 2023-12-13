const GameOver = ({ gameMode, gameGenre, score }) => {
  return (
    <div>
      <ul>
        <li>gameMode: {gameMode}</li>
        <li>gameGenre: {gameGenre}</li>
        <li>score: {score.current}</li>
      </ul>
      <section id="score">
        {/* display results */}
        <h2>
          You're score was: <span class="results"></span>
        </h2>
        <h3>
          Game mode: <span class="results"></span>
        </h3>
        <h3>
          Genre: <span class="results"></span>
        </h3>
      </section>
      <section id="user-info">
        {/* user inputs info for scoreboard */}
        <h2>Enter Player Name:</h2>
        <div class="ui input">
          <input class="username-input" type="text" placeholder="Name" />
          <button class="custom-btn" id="save-btn" type="button">
            Save
          </button>
        </div>
      </section>
    </div>
  );
};

export default GameOver;
