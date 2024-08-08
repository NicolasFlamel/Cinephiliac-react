import { useEffect, useState } from 'react';
import { GameProps } from 'types';
import { Fallback, GameOver, Loading, MovieMotion } from 'components';
import { useGetMovieList, useMutateNextMovie, useMutateRemovePair } from 'api';
import { useGameState } from 'context/GameContext';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';

const Game = ({ score }: GameProps) => {
  const qClient = useQueryClient();
  const { gameGenre, gameMode } = useGameState();
  const [gameIsOver, setGameIsOver] = useState(false);
  const [listQuery, pairQuery, [firstMovie, secondMovie]] =
    useGetMovieList(gameGenre);
  const { mutate: nextMovie } = useMutateNextMovie(gameGenre);
  const { mutate: removePair } = useMutateRemovePair(gameGenre);

  useEffect(() => {
    score.current = 0;

    return () => {
      // clear the pair cache so wont appear on next game
      const queryKey = ['moviePair', gameGenre];
      qClient.resetQueries({ queryKey, exact: true });
    };
  }, [score, gameGenre, qClient]);

  useEffect(() => {
    if (!pairQuery.data) return;

    removePair();
  }, [pairQuery.data, removePair]);

  // conditional rendering
  if (gameIsOver) return <GameOver {...{ gameMode, gameGenre, score }} />;
  else if (listQuery.isPending) return <Loading>Fetching Movies</Loading>;
  else if (listQuery.isError) return <Fallback error={listQuery.error} />;
  else if (pairQuery.isPending) return <Loading>Getting Movie Pair</Loading>;
  else if (pairQuery.isError) return <Fallback error={pairQuery.error} />;

  const compareMovies = (choice: '>' | '<') => {
    const compareFunction = {
      '>': (secondStat: number, firstStat: number) => {
        return secondStat > firstStat;
      },
      '<': (secondStat: number, firstStat: number) => {
        return secondStat < firstStat;
      },
    };

    if (firstMovie.isLoading || secondMovie.isLoading) return;
    else if (firstMovie.isError || secondMovie.isError) return;
    else if (!firstMovie.data || !secondMovie.data) return;

    const [firstStat, secondStat] = [firstMovie, secondMovie].map(({ data }) =>
      gameMode === 'Box-Office'
        ? Number(data.boxOffice.match(/\d+/g)?.join(''))
        : Number(data.rating),
    );

    return compareFunction[choice](secondStat, firstStat);
  };

  const handleAnswerClick = (userInput: '>' | '<') => {
    const correct = compareMovies(userInput);

    if (!correct) return gameOver();

    score.current++;
    listQuery.data.length > 0 ? nextMovie() : gameOver();
  };

  const gameOver = () => {
    setGameIsOver(true);
  };

  return (
    <section className="flex justify-center w-full">
      <Card className="grid justify-center gap-4 p-4 w-full">
        <CardHeader className="row-start-1 justify-center min-h-12">
          <h2 className="text-center max-w-max">
            Does <em> {pairQuery.data[1].title} </em>
            have a higher or lower {gameMode} amount than
            <em> {pairQuery.data[0].title}</em>?
          </h2>
        </CardHeader>
        <Divider />
        <CardBody className="justify-center overflow-hidden min-h-[650px]">
          <MovieMotion
            moviePair={[firstMovie, secondMovie]}
            backupData={pairQuery.data}
            className="grid md:gap-4 md:grid-cols-2 md:divide-y-0 divide-y-large justify-center p-4"
          />
        </CardBody>
        <CardFooter className="flex flex-wrap justify-center gap-4">
          <Button color="danger" onClick={() => handleAnswerClick('>')}>
            Higher
          </Button>
          <Button color="primary" onClick={() => handleAnswerClick('<')}>
            Lower
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Game;
