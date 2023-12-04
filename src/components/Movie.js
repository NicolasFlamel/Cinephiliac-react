import noImg from '../assets/img/no-image-placeholder.png';

const Movie = ({ movieData }) => {
  return (
    <>
      <img
        className="movie-poster"
        src={movieData.posterUrl}
        alt={movieData.title + ' poster'}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = noImg;
        }}
      />
      <h2 className="movie-name">{movieData.title}</h2>
    </>
  );
};

export default Movie;
