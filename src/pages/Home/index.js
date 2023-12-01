import './styles.css';
import { useNavigate } from 'react-router';

const Home = ({ setGameMode, setGameGenre }) => {
  const navigate = useNavigate();

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setGameMode(e.currentTarget.game.value);
    setGameGenre(e.currentTarget.genre.value);
    navigate('/game');
  };

  return (
    <form id="game-form" onSubmit={formSubmitHandler}>
      <select name="game" className="custom-btn">
        <option value="Box-Office">Box OFfice Mode</option>
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
