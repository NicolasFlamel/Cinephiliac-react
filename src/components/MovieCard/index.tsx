import { useEffect, useState } from 'react';
import noImg from 'assets/img/no-image-placeholder.png';
import { Movie } from 'types';

const MovieCard = ({ movieData }: { movieData: Movie }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgLoaded(true);
    };
    if (movieData.posterUrl) img.src = movieData.posterUrl;
  }, [movieData.posterUrl]);

  return (
    <>
      <div className={imgLoaded ? 'movie-poster' : 'img-placeholder'}>
        {imgLoaded ? (
          <img
            src={movieData.posterUrl}
            alt={movieData.title + ' poster'}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = noImg;
            }}
          />
        ) : (
          <span>Loading</span>
        )}
      </div>
      <h2>{movieData.title}</h2>
    </>
  );
};

export default MovieCard;
