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
      {!imgLoaded ? (
        <img
          className="movie-poster"
          src={movieData.posterUrl}
          alt={movieData.title + ' poster'}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = noImg;
          }}
        />
      ) : (
        <span className='img-placeholder'>Loading</span>
      )}
      <h2 className="movie-name">{movieData.title}</h2>
    </>
  );
};

export default Movie;
