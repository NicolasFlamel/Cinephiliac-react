import './styles.css';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  let location = useLocation();
  const returnBtn = (
    <Link to={''} className="custom-btn">
      Return Home
    </Link>
  );

  switch (location.pathname) {
    case '/':
      break;
    case '/game':
      break;
    case '/game-over':
      break;
    case '/score-board':
      break;
    default:
      console.error(location.pathname);
      return <h1>Error</h1>;
  }
  return (
    <header className="App-header">
      <h1>Cinephiliac</h1>
      <nav className="nav-btns">
        {location.pathname !== '/' ? returnBtn : null}
        <Link to={'/score-board'} className="custom-btn">
          Score board
        </Link>
      </nav>
    </header>
  );
};

export default Header;
