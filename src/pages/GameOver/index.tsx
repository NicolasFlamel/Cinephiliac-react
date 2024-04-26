import { useRef, useState } from 'react';
import { GameProps } from 'types';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { Button } from '@nextui-org/react';

const GameOver = ({ gameMode, gameGenre, score }: GameProps) => {
  const username = useRef('');
  const [saved, setSaved] = useState(false);
  const [scoreBoard, setScoreBoard] = useLocalStorage('cinephiliacSB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.current === '') return;

    const userScore = {
      id: crypto.randomUUID(),
      gameMode,
      gameGenre,
      score: score.current,
      username: username.current,
    };

    setScoreBoard(scoreBoard.concat([userScore]));
    setSaved(true);
  };

  return (
    <div>
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="username"
            onChange={(e) => (username.current = e.target.value)}
            disabled={saved}
          />
          <Button type="submit" id="save-btn" disabled={saved}>
            Save
          </Button>
        </form>
      </section>
    </div>
  );
};

export default GameOver;
