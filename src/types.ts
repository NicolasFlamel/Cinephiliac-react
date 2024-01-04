import { MutableRefObject } from 'react';

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
