import './App.css';
import { useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Game, GameOver, Home, ScoreBoard } from './pages';
import { Header } from './components';
import { NextUIProvider } from '@nextui-org/react';

function App() {
  const [gameMode, setGameMode] = useState('Box-Office');
  const [gameGenre, setGameGenre] = useState('All-Genres');
  const score = useRef<number>(0);

  return (
    <NextUIProvider>
      <div className="App">
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
            <Route path="/score-board" element={<ScoreBoard />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </NextUIProvider>
  );
}

export default App;
