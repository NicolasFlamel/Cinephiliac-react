import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameProps } from 'types';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from '@nextui-org/react';
import { addScore } from 'helpers/localScoreboard';
import { useGameState } from 'context/GameContext';

const GameOver = ({ score }: GameProps) => {
  const { gameGenre, gameMode } = useGameState();
  const username = useRef('');
  const navigate = useNavigate();

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

    addScore(userScore);
    navigate('/scoreboard');
  };

  return (
    <section className="flex justify-center">
      <Card className="inline-block justify-center gap-4">
        <CardHeader>
          <p>Game over!</p>
        </CardHeader>
        <Divider />
        <CardBody id="score" className="grid gap-4">
          {/* display results */}
          <section>
            <p>You're score was: {score.current}</p>
            <p>
              Game mode: {gameMode === 'Box-Office' ? 'Box Office' : 'Ratings'}
            </p>
            <p>
              Genre: {gameGenre === 'All-Genres' ? 'All Genres' : gameGenre}
            </p>
          </section>
          <section id="user-info">
            {/* user inputs info for scoreboard */}
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-wrap md:flex-nowrap gap-4"
            >
              <Input
                type="text"
                label="Username"
                name="username"
                isRequired={true}
                onChange={(e) => (username.current = e.target.value)}
              />
              <Button className="m-auto" type="submit" id="save-btn">
                Submit
              </Button>
            </form>
          </section>
        </CardBody>
      </Card>
    </section>
  );
};

export default GameOver;
