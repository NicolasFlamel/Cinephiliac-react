import './App.css';
import { useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { GameGenreType, GameModeType } from 'types';
import { Game, GameOver, Home, ScoreBoard } from './pages';
import { Header } from './components';

function App() {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameModeType>('Box-Office');
  const [gameGenre, setGameGenre] = useState<GameGenreType>('All-Genres');
  const score = useRef<number>(0);
  document.documentElement.className = 'dark text-foreground bg-background';

  return (
    <NextUIProvider navigate={navigate}>
      <div className="App container mx-auto p-4 bg-foreground-200">
        <Header />
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
                <Game gameMode={gameMode} gameGenre={gameGenre} score={score} />
              }
            />
            <Route
              path="/game-over"
              element={
                <GameOver
                  gameMode={gameMode}
                  gameGenre={gameGenre}
                  score={score}
                />
              }
            />
            <Route path="/scoreboard" element={<ScoreBoard />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </NextUIProvider>
  );
}

export default App;
