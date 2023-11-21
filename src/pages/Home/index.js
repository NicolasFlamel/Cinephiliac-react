import { useNavigate } from 'react-router';
import './styles.css';

const Home = () => {
  const navigate = useNavigate();

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const gameMode = e.currentTarget.game.value;
    const genre = e.currentTarget.genre.value;
    navigate('/game', { state: { gameMode, genre } });
  };

  return (
    <form id="game-form" onSubmit={formSubmitHandler}>
      <select name="game" className="custom-btn">
        <option value="box_office">Box OFfice Mode</option>
        <option value="rating">Ratings Mode</option>
      </select>
      <select name="genre" id="bo-genre" className="custom-btn">
        <option value="all_genres">All Genre</option>
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
