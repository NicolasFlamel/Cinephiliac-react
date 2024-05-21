import { AnimatePresence, Reorder } from 'framer-motion';
import MovieCard from 'components/MovieCard';
import { UseQueryResult } from '@tanstack/react-query';
import { MoviePair, MovieWithStats } from 'types';

interface MovieMotionProps extends React.HTMLAttributes<HTMLElement> {
  moviePair: [
    UseQueryResult<MovieWithStats, Error>,
    UseQueryResult<MovieWithStats, Error>,
  ];
  backupData: MoviePair;
}

const MovieMotion = ({
  moviePair,
  backupData,
  className,
}: MovieMotionProps) => {
  return (
    <Reorder.Group
      as="section"
      values={moviePair}
      onReorder={() => {}}
      className={className}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {moviePair.map((movie, index) => {
          return (
            <Reorder.Item
              as="article"
              key={movie.data?.imdbId || backupData[index].imdbId}
              value={movie.data?.imdbId || backupData[index].imdbId}
              initial={{
                x: 100,
                y: -200,
                opacity: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: 1,
              }}
              exit={{ x: -100, y: 200, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-row grid-rows-[auto max-content auto] grid-cols-subgrid text-center justify-items-center gap-4 py-4"
            >
              <MovieCard movieData={movie} showStat={!index} />
            </Reorder.Item>
          );
        })}
      </AnimatePresence>
    </Reorder.Group>
  );
};

export default MovieMotion;
