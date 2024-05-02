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
