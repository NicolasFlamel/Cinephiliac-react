import './styles.css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dispatcher } from 'types';
import { ReactComponent as Sun } from 'assets/img/sun.svg';
import { ReactComponent as Moon } from 'assets/img/moon.svg';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Switch,
} from '@nextui-org/react';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  darkMode: boolean;
  setDarkMode: Dispatcher<boolean>;
}

const Header = ({ darkMode, setDarkMode }: HeaderProps) => {
  let location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      className="mb-4"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <h1 className="font-bold text-inherit text-2xl">Cinephiliac</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4 flex-wrap"
        justify="center"
      >
        <NavbarItem isActive={location.pathname === '/'}>
          <Link href={''}>Home</Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === '/scoreboard'}>
          <Link href={'/scoreboard'}>Scoreboard</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="hidden sm:flex gap-4 flex-wrap">
        <NavbarItem className="flex flex-wrap">
          <Switch
            size="lg"
            isSelected={darkMode}
            startContent={<Sun fill="yellow" />}
            endContent={<Moon fill="black" />}
            onChange={({ currentTarget }) => setDarkMode(currentTarget.checked)}
          />
        </NavbarItem>
      </NavbarContent>

      {/* Navbar mobile menu */}
      <NavbarMenu className="m-4 p-4 gap-8 w-auto">
        <NavbarMenuItem>
          <Link href={''} size="lg" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href={'/scoreboard'}
            size="lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Scoreboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Switch
            size="lg"
            isSelected={darkMode}
            startContent={<Sun fill="yellow" />}
            endContent={<Moon fill="black" />}
            onChange={({ currentTarget }) => setDarkMode(currentTarget.checked)}
          />
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
