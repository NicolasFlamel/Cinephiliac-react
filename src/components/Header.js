import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  let location = useLocation();

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
      <nav>
        <ul style={{ listStyle: 'none' }}>
          <li>
            <Link to={'/'}>Home</Link>
          </li>
          <li>
            <Link to={'/game'}>Game</Link>
          </li>
          <li>
            <Link to={'game-over'}>Game Over</Link>
          </li>
          <li>
            <Link to={'score-board'}>Score board</Link>
          </li>
        </ul>
      </nav>
      <h1>🎬Cinephiliac🎬</h1>
    </header>
  );
};

export default Header;
