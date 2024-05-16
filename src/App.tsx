import './App.css';
import { useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Game, Home, Scoreboard } from './pages';
import { Header } from './components';
import { GameProvider } from 'context/GameContext';

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const score = useRef<number>(0);
  const [darkMode, setDarkMode] = useState(false);
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
                <GameProvider>
                  <Home />
                </GameProvider>
              }
            />
            <Route
              path="/game"
              element={
                <GameProvider>
                  <QueryClientProvider client={queryClient}>
                    <Game score={score} />
                  </QueryClientProvider>
                </GameProvider>
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
