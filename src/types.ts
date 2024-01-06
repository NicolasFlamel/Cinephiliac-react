import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export interface Movie {
  imdbId: string;
  genre?: Array<string>;
  title?: string;
  boxOffice?: string;
  rating?: string;
  posterUrl?: string;
}

export interface GameProps {
  gameMode: string;
  gameGenre: string;
  score: MutableRefObject<number>;
}

export interface ScoreData {
  id: string;
  gameMode: string;
  gameGenre: string;
  score: number;
  username: string;
}

export type Dispatcher<T> = Dispatch<SetStateAction<T>>;
