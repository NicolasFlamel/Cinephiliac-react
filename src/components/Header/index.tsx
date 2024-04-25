import './styles.css';
import { useLocation } from 'react-router-dom';
import { Link } from '@nextui-org/react';

const Header = () => {
  let location = useLocation();
  const returnBtn = <Link href={''}>Return Home</Link>;

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
    <header>
      <h1>Cinephiliac</h1>
      <nav>
        {location.pathname !== '/' ? returnBtn : null}
        <Link href={'/score-board'}>Score board</Link>
      </nav>
    </header>
  );
};

export default Header;
