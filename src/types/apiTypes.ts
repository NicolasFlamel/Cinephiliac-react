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

export type MovieStatsAPI = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
};

/**
 * {
  "Title": "The Martian",
  "Year": "2015",
  "Rated": "PG-13",
  "Released": "02 Oct 2015",
  "Runtime": "144 min",
  "Genre": "Adventure, Drama, Sci-Fi",
  "Director": "Ridley Scott",
  "Writer": "Drew Goddard, Andy Weir",
  "Actors": "Matt Damon, Jessica Chastain, Kristen Wiig",
  "Plot": "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive and can survive until a potential rescue.",
  "Language": "English, Mandarin",
  "Country": "United States, United Kingdom, Hungary, Jordan",
  "Awards": "Nominated for 7 Oscars. 40 wins & 199 nominations total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "8.0/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "91%"
    },
    {
      "Source": "Metacritic",
      "Value": "80/100"
    }
  ],
  "Metascore": "80",
  "imdbRating": "8.0",
  "imdbVotes": "924,576",
  "imdbID": "tt3659388",
  "Type": "movie",
  "DVD": "22 Dec 2015",
  "BoxOffice": "$228,433,663",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
}
 */
