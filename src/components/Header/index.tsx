import './styles.css';
import { useLocation } from 'react-router-dom';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Switch,
} from '@nextui-org/react';
import { Dispatcher } from 'types';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  setDarkMode: Dispatcher<boolean>;
}

const Header = ({ setDarkMode }: HeaderProps) => {
  let location = useLocation();

  return (
    <header className="mb-4">
      <Navbar>
        <NavbarBrand>
          <h1 className="font-bold text-inherit">Cinephiliac</h1>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4" justify="center">
          <NavbarItem isActive={location.pathname === '/'}>
            <Link href={''}>Home</Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === '/scoreboard'}>
            <Link href={'/scoreboard'}>Scoreboard</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Switch
              onChange={({ currentTarget }) =>
                setDarkMode(currentTarget.checked)
              }
            >
              Dark Mode
            </Switch>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </header>
  );
};

export default Header;
