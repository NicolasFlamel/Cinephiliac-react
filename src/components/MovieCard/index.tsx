import { GameModeType } from 'types';
import { Image } from '@nextui-org/react';
import noImg from 'assets/img/no-image-placeholder.png';

interface MovieCardProps {
  movieData: any;
  gameMode: GameModeType;
  showStat?: boolean;
}

const MovieCard = ({ movieData, gameMode, showStat }: MovieCardProps) => {
  // remove this pending and instead use it inside normal return
  if (movieData.isPending) return <h1>Loading stats</h1>;
  else if (movieData.isError) {
    console.error(movieData.error);
    return <h1>Errored</h1>;
  }

  return (
    <article className="grid grid-row grid-rows-[auto max-content auto] grid-cols-subgrid text-center justify-items-center gap-4 py-4">
      <h2 className="row-start-1">
        {gameMode +
          ': ' +
          (showStat
            ? gameMode === 'Box-Office'
              ? movieData.data.boxOffice
              : movieData.data.rating || 'Loading'
            : '???')}
      </h2>
      <Image
        width={300}
        height={400}
        className="row-start-2"
        src={
          movieData.isPending ? undefined : movieData.data.posterUrl || noImg
        }
        alt={movieData.data.title + ' poster'}
      />
      <h2 className="mt-auto">{movieData.data.title}</h2>
    </article>
  );
};

export default MovieCard;
