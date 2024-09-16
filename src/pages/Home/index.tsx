import { useNavigate } from 'react-router';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { genres, gameModes } from './data';
import { useGameDispatch, useGameState } from 'context/GameContext';

interface FormElements extends HTMLFormControlsCollection {
  game: HTMLInputElement;
  genre: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const Home = () => {
  const navigate = useNavigate();
  const { gameGenre, gameMode } = useGameState();
  const { setGameGenre, setGameMode } = useGameDispatch();

  const formSubmitHandler = (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    const { currentTarget } = e;
    const game = currentTarget.game.value;
    const genre = currentTarget.genre.value;

    if (!game || !genre) return;

    setGameMode(game);
    setGameGenre(genre);
    navigate('/game');
  };

  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader>
          <p>Welcome to my little game!</p>
        </CardHeader>
        <CardBody>
          <p>
            It's a very simple game, you will be presented with two movie
            titles/posters. The first movie you will be given either how much
            gross they earned in the box-office or their overall rating. You
            have to guess whether the second movie's box-office/ratings is
            higher or lower compared to the first movie.
          </p>
          <p>
            Each correct answer gives you one point and at the end your score
            will be saved locally for you to see on the scoreboard
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <form
            id="game-form"
            onSubmit={formSubmitHandler}
            className="grid grid-rows-3 md:grid-rows-2 md:grid-cols-2 gap-4 items-center justify-items-center"
          >
            <Select
              label="Select a mode"
              name="game"
              className="max-w-xs md:justify-self-end"
              defaultSelectedKeys={[gameMode]}
            >
              {gameModes.map((gameModeData) => (
                <SelectItem key={gameModeData.value} value={gameModeData.value}>
                  {gameModeData.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Select a genre"
              name="genre"
              className="max-w-xs md:justify-self-start"
              defaultSelectedKeys={[gameGenre]}
            >
              {genres.map((genre) => (
                <SelectItem key={genre.value} value={genre.value}>
                  {genre.label}
                </SelectItem>
              ))}
            </Select>
            <Button type="submit" color="primary" className="md:col-span-2">
              Start
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
};

export default Home;
