import { useEffect, useState } from 'react';
import noImg from '../../assets/img/no-image-placeholder.png';

const Movie = ({ movieData }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgLoaded(true);
    };
    img.src = movieData.posterUrl;
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
      <h2 className="movie-name">{movieData.title}</h2>
    </>
  );
};

export default Movie;
