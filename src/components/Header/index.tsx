import './styles.css';
import { useLocation } from 'react-router-dom';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';

const Header = () => {
  let location = useLocation();

  return (
    <header className="mb-4">
      <Navbar>
        <NavbarBrand>
          <h1 className="font-bold text-inherit">Cinephiliac</h1>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4" justify="center">
          <NavbarItem isActive={location.pathname === '/'}>
            <Link href={''}>Return Home</Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === '/scoreboard'}>
            <Link href={'/scoreboard'}>Scoreboard</Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </header>
  );
};

export default Header;
