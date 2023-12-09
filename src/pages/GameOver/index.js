const GameOver = ({ gameMode, gameGenre, score }) => {
  return (
    <div>
      <ul>
        <li>gameMode: {gameMode}</li>
        <li>gameGenre: {gameGenre}</li>
        <li>score: {score.current}</li>
      </ul>
    </div>
  );
};

export default GameOver;
