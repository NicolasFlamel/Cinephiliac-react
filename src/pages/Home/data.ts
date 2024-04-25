import { GameGenreType, GameModeType } from 'types';

type gameModesList = Array<{ label: string; value: GameModeType }>;
type genresList = Array<{ label: string; value: GameGenreType }>;

export const gameModes: gameModesList = [
  { label: 'Box Office Mode', value: 'Box-Office' },
  { label: 'Ratings Mode', value: 'Ratings' },
];

export const genres: genresList = [
  { label: 'All Genres', value: 'All-Genres' },
  { label: 'Action', value: 'Action' },
  { label: 'Animation', value: 'Animation' },
  { label: 'Comedy', value: 'Comedy' },
  { label: 'Crime', value: 'Crime' },
  { label: 'Family', value: 'Family' },
  { label: 'Horror', value: 'Horror' },
  { label: 'Romance', value: 'Romance' },
  { label: 'Sci-Fi', value: 'Sci-Fi' },
  { label: 'Thriller', value: 'Thriller' },
];
