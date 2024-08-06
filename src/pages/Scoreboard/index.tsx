import { GameModeType, ScoreData } from 'types';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Tooltip,
} from '@nextui-org/react';
import { deleteScores, getScores } from 'helpers/localScoreboard';
import { DeleteIcon } from 'components/DeleteIcon';

const Scoreboard = () => {
  const scoreboard = getScores();

  const boxOfficeScores = scoreboard.filter(
    (score) => score.gameMode === 'Box-Office',
  );
  const ratingsScores = scoreboard.filter(
    (score) => score.gameMode === 'Ratings',
  );
  const board = [
    ['Box-Office', boxOfficeScores],
    ['Ratings', ratingsScores],
  ] as const;

  return (
    <section>
      {board.map(([mode, scores]) => (
        <section key={mode} className="my-4">
          <h2 className="my-2 font-bold text-inherit text-2xl">Box Office</h2>
          <ScoreTable mode={mode} scores={scores} />
        </section>
      ))}
    </section>
  );
};

type ScoreTableProps = { mode: GameModeType; scores: ScoreData[] };

const ScoreTable = ({ mode, scores }: ScoreTableProps) => {
  const handleDelete = (id: string) => () => {
    deleteScores(id);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'score', label: 'Score' },
    { key: 'genre', label: 'Genre' },
    { key: 'action', label: 'Action' },
  ];
  const createTableRowsObj = (score: ScoreData) => ({
    key: score.id,
    name: score.username,
    score: score.score,
    genre: score.gameGenre,
    action: (
      <Tooltip color="danger" content="Delete entry">
        <span
          onClick={handleDelete(score.id)}
          className="text-lg text-danger cursor-pointer active:opacity-50"
        >
          <DeleteIcon />
        </span>
      </Tooltip>
    ),
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

export default Scoreboard;
