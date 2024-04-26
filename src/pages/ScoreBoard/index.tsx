import { GameModeType, ScoreData } from 'types';
import { useLocalStorage } from 'hooks/useLocalStorage';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react';

const ScoreBoard = () => {
  const [scoreBoard] = useLocalStorage('cinephiliacSB');

  const boxOfficeScores = scoreBoard.filter(
    (score) => score.gameMode === 'Box-Office',
  );
  const ratingsScores = scoreBoard.filter(
    (score) => score.gameMode === 'Ratings',
  );

  return (
    <section>
      <section>
        <h2>Box Office</h2>
        <ScoreTable mode={'Box-Office'} scores={boxOfficeScores} />
      </section>

      <section>
        <h2>Ratings</h2>
        <ScoreTable mode={'Ratings'} scores={ratingsScores} />
      </section>
    </section>
  );
};

type ScoreTableProps = { mode: GameModeType; scores: ScoreData[] };

const ScoreTable = ({ mode, scores }: ScoreTableProps) => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'score', label: 'Score' },
    { key: 'genre', label: 'Genre' },
  ];
  const createTableRowsObj = (score: ScoreData) => ({
    key: score.id,
    name: score.username,
    score: score.score,
    genre: score.gameGenre,
  });
  const rows = scores.map(createTableRowsObj);

  return (
    <Table color="default" selectionMode="single" aria-label={mode + ' scores'}>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ScoreBoard;
