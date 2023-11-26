const Movie = ({ movieData }) => {
  return (
    <>
      <img
        className="movie-poster"
        src={movieData.primaryImage.url}
        alt={movieData.originalTitleText.text + ' poster'}
      />
      <h2 className="movie-name">{movieData.originalTitleText.text}</h2>
    </>
  );
};

export default Movie;
