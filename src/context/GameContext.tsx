import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { GameGenreType, GameModeType } from 'types';

interface IGameContext {
  gameMode: GameModeType;
  gameGenre: GameGenreType;
}

interface IGameDispatchContext {
  setGameMode: Dispatch<SetStateAction<GameModeType>>;
  setGameGenre: Dispatch<SetStateAction<GameGenreType>>;
}

const defaultState = {} as IGameContext;
const defaultDispatchState = {} as IGameDispatchContext;

const GameContext = createContext(defaultState);
const GameDispatchContext = createContext(defaultDispatchState);

export const useGameState = () => {
  return useContext(GameContext);
};
export const useGameDispatch = () => {
  return useContext(GameDispatchContext);
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameMode, setGameMode] = useState<GameModeType>('Box-Office');
  const [gameGenre, setGameGenre] = useState<GameGenreType>('All-Genres');

  const stateValues = {
    gameMode,
    gameGenre,
  };
  const dispatchValues = {
    setGameMode,
    setGameGenre,
  };

  return (
    <GameContext.Provider value={stateValues}>
      <GameDispatchContext.Provider value={dispatchValues}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};
