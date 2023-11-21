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
      {location.pathname !== '/' ? returnBtn : null}
      <h1>🎬Cinephiliac🎬</h1>
      <Link to={'/score-board'} className="custom-btn">
        Score board
      </Link>
    </header>
  );
};

export default Header;
