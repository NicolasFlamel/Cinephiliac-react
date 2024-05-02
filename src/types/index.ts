import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { MovieDatabaseApiType, MovieDatabaseResultsType } from './apiTypes';

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
  title: string;
}

export interface MovieWithStats extends Movie {
  boxOffice: string;
  rating: string;
  posterUrl?: string;
}

export type MovieTypes = Movie | MovieWithStats;

export interface MovieDBWithoutStats extends Movie {
  genre: GameGenreType[];
}

export interface MovieDBWithStats extends MovieWithStats {
  genre: GameGenreType[];
}

export type MovieIndexedDB = MovieDBWithoutStats | MovieDBWithStats;

export type MovieList = Movie | MovieIndexedDB;

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

export const isGameModeType = (value: string): value is GameModeType =>
  gameModes.includes(value as GameModeType);

export const isGameGenreType = (value: string): value is GameGenreType =>
  genres.includes(value as GameGenreType);

export type { MovieDatabaseApiType, MovieDatabaseResultsType };
