import './styles.css';
import { useLocation } from 'react-router-dom';
import { ReactComponent as Sun } from 'assets/img/sun.svg';
import { ReactComponent as Moon } from 'assets/img/moon.svg';
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
      <Navbar className="py-4">
        <NavbarBrand>
          <h1 className="font-bold text-inherit">Cinephiliac</h1>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4 flex-wrap" justify="center">
          <NavbarItem isActive={location.pathname === '/'}>
            <Link href={''}>Home</Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === '/scoreboard'}>
            <Link href={'/scoreboard'}>Scoreboard</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="flex flex-wrap">
            <Switch
              size="lg"
              startContent={<Sun fill="yellow" />}
              endContent={<Moon fill="black" />}
              onChange={({ currentTarget }) =>
                setDarkMode(currentTarget.checked)
              }
            />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </header>
  );
};

export default Header;
