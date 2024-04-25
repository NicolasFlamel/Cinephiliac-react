import './styles.css';
import { useNavigate } from 'react-router';
import { Dispatcher } from 'types';

interface HomeProps {
  setGameMode: Dispatcher<string>;
  setGameGenre: Dispatcher<string>;
}

const Home = ({ setGameMode, setGameGenre }: HomeProps) => {
  const navigate = useNavigate();

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      game: { value: string };
      genre: { value: string };
    };
    const game = target.game.value;
    const genre = target.genre.value;

    setGameMode(game);
    setGameGenre(genre);
    navigate('/game');
  };

  return (
    <form id="game-form" onSubmit={formSubmitHandler}>
      <select name="game" className="custom-btn">
        <option value="Box-Office">Box Office Mode</option>
        <option value="Ratings">Ratings Mode</option>
      </select>
      <select name="genre" id="bo-genre" className="custom-btn">
        <option value="All-Genres">All Genre</option>
        <option value="Action">Action</option>
        <option value="Animation">Animation</option>
        <option value="Comedy">Comedy</option>
        <option value="Crime">Crime</option>
        <option value="Family">Family</option>
        <option value="Horror">Horror</option>
        <option value="Romance">Romance</option>
        <option value="Sci-Fi">Sci-Fi</option>
        <option value="Thriller">Thriller</option>
      </select>
      <button type="submit" className="custom-btn">
        Start
      </button>
    </form>
  );
};

export default Home;
