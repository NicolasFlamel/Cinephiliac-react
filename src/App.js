import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import { Game, GameOver, Home, ScoreBoard } from './pages';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul style={{ listStyle: 'none' }}>
            <li>
              <Link to={''}>Home</Link>
            </li>
            <li>
              <Link to={'/game'}>Game</Link>
            </li>
            <li>
              {' '}
              <Link to={'game-over'}>Game Over</Link>
            </li>
            <li>
              <Link to={'score-board'}>Score board</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game-over" element={<GameOver />} />
          <Route path="/score-board" element={<ScoreBoard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
