import './styles.css';
import { ScoreData } from 'types';
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
  const boxOfficeRows = scoreBoard
    .filter((score) => score.gameMode === 'Box-Office')
    .map(createTableRowsObj);
  const ratingsRows = scoreBoard
    .filter((score) => score.gameMode === 'Ratings')
    .map(createTableRowsObj);

  return (
    <section>
      <section>
        <h1>Box Office</h1>
        <Table aria-label="Box Office scores">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={boxOfficeRows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <section>
        <Table aria-label="Ratings scores">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={ratingsRows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </section>
  );
};

export default ScoreBoard;
