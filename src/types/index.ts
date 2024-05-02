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

/**
 * imdbID - string
 *
 * genre - Array<string>;
 *
 * title - string;
 *
 * boxOffice - string;
 *
 * rating - string;
 *
 * posterUrl? - string;
 */
export interface Movie {
  imdbId: string;
  title: string;
  boxOffice: string;
  rating: string;
  genre?: Array<string>;
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

export type MovieDatabaseResultsType = {
  id: string;
  originalTitleText: {
    text: string;
  };
  position: number;
  primaryImage?: {
    caption: {
      plainText: string;
    };
    width: number;
    height: number;
    id: string;
    url: string;
  };
  releaseDate: { day: number; month: number; year: number };
  titleText: { text: string };
};

export type MovieDatabaseApiType = {
  entries: number;
  next: string | null;
  page: string | number;
  results: MovieDatabaseResultsType[];
};
