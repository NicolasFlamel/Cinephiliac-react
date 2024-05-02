import './App.css';
import { useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { GameGenreType, GameModeType } from 'types';
import { Game, Home, Scoreboard } from './pages';
import { Header } from './components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [gameMode, setGameMode] = useState<GameModeType>('Box-Office');
  const [gameGenre, setGameGenre] = useState<GameGenreType>('All-Genres');
  const score = useRef<number>(0);
  const docClassList = document.documentElement.classList;

  if (darkMode) docClassList.add('dark');
  else docClassList.remove('dark');

  return (
    <NextUIProvider navigate={navigate}>
      <div className="App container mx-auto p-4 bg-foreground-200 max-w-screen-lg">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home setGameMode={setGameMode} setGameGenre={setGameGenre} />
              }
            />
            <Route
              path="/game"
              element={
                <QueryClientProvider client={queryClient}>
                  <Game
                    gameMode={gameMode}
                    gameGenre={gameGenre}
                    score={score}
                  />
                </QueryClientProvider>
              }
            />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </NextUIProvider>
  );
}

export default App;
