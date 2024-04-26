import { GameModeType, Movie } from 'types';
import { Divider, Image } from '@nextui-org/react';
import noImg from 'assets/img/no-image-placeholder.png';

interface MovieCardProps {
  movieData: Movie;
  gameMode: GameModeType;
  showStat: boolean;
}

const MovieCard = ({ movieData, gameMode, showStat }: MovieCardProps) => {
  return (
    <article
      key={movieData.imdbId}
      className="grid grid-row grid-rows-[auto max-content auto] grid-cols-subgrid text-center justify-items-center gap-4 py-4"
    >
      <h2 className="row-start-1">
        {gameMode +
          ': ' +
          (showStat
            ? gameMode === 'Box-Office'
              ? movieData.boxOffice
              : movieData.rating || 'Loading'
            : '???')}
      </h2>
      <Image
        width={300}
        height={400}
        className="row-start-2"
        src={movieData.posterUrl || noImg}
        alt={movieData.title + ' poster'}
      />
      <h2 className="mt-auto">{movieData.title}</h2>
    </article>
  );
};

export default MovieCard;
