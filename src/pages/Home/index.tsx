import './styles.css';
import { useNavigate } from 'react-router';
import { Dispatcher, GameGenreType, GameModeType } from 'types';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { genres, gameModes } from './data';

interface HomeProps {
  setGameMode: Dispatcher<GameModeType>;
  setGameGenre: Dispatcher<GameGenreType>;
}

interface FormElements extends HTMLFormControlsCollection {
  game: HTMLInputElement;
  genre: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const Home = ({ setGameMode, setGameGenre }: HomeProps) => {
  const navigate = useNavigate();

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
    <form
      id="game-form"
      onSubmit={formSubmitHandler}
      className="flex w-full flex-wrap md:flex-nowrap gap-4"
    >
      <Select
        label="Select a mode"
        name="game"
        className="max-w-xs"
        defaultSelectedKeys={['Box-Office']}
      >
        {gameModes.map((gameMode) => (
          <SelectItem key={gameMode.value} value={gameMode.value}>
            {gameMode.label}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Select a genre"
        name="genre"
        className="max-w-xs"
        defaultSelectedKeys={['All-Genres']}
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
  );
};

export default Home;
