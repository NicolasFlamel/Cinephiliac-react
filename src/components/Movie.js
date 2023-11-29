import noImg from '../assets/img/no-image-placeholder.png';

const Movie = ({ movieData }) => {
  return (
    <>
      <img
        className="movie-poster"
        src={movieData.primaryImage.url}
        alt={movieData.originalTitleText.text + ' poster'}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = noImg;
        }}
      />
      <h2 className="movie-name">{movieData.originalTitleText.text}</h2>
    </>
  );
};

export default Movie;
