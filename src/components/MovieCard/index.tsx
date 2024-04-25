import { Movie } from 'types';
import { Image } from '@nextui-org/react';
import noImg from 'assets/img/no-image-placeholder.png';

const MovieCard = ({ movieData }: { movieData: Movie }) => {
  return (
    <>
      <div>
        <Image
          width={300}
          height={400}
          src={movieData.posterUrl || noImg}
          alt={movieData.title + ' poster'}
        />
      </div>
      <h2>{movieData.title}</h2>
    </>
  );
};

export default MovieCard;
