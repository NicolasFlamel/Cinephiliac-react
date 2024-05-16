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

interface HomeProps {}

interface FormElements extends HTMLFormControlsCollection {
  game: HTMLInputElement;
  genre: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const Home = (props: HomeProps) => {
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
      <form
        id="game-form"
        onSubmit={formSubmitHandler}
        className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center items-center"
      >
        <Select
          label="Select a mode"
          name="game"
          className="max-w-xs"
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
          className="max-w-xs"
          defaultSelectedKeys={[gameGenre]}
        >
          {genres.map((genre) => (
            <SelectItem key={genre.value} value={genre.value}>
              {genre.label}
            </SelectItem>
          ))}
        </Select>
        <Button type="submit" color="primary">
          Start
        </Button>
      </form>
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
    </section>
  );
};

export default Home;
