import { Dispatch, MutableRefObject, SetStateAction } from 'react';

const gameModes = ['Box-Office', 'Ratings'] as const;
const genres = [
  'All-Genres',
  'Action',
  'Animation',
  'Comedy',
  'Crime',
  'Family',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
] as const;

export interface Movie {
  imdbId: string;
  genre?: Array<string>;
  title?: string;
  boxOffice?: string;
  rating?: string;
  posterUrl?: string;
}

export interface GameProps {
  gameMode: GameModeType;
  gameGenre: GameGenreType;
  score: MutableRefObject<number>;
}

export interface ScoreData {
  id: string;
  gameMode: GameModeType;
  gameGenre: GameGenreType;
  score: number;
  username: string;
}

export type GameModeType = (typeof gameModes)[number];

export type GameGenreType = (typeof genres)[number];

export type Dispatcher<T> = Dispatch<SetStateAction<T>>;

export const isGameModeType = (value: string): value is GameModeType => {
  return gameModes.includes(value as GameModeType);
};

export const isGameGenreType = (value: string): value is GameGenreType => {
  return genres.includes(value as GameGenreType);
};
