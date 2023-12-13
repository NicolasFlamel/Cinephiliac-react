import './styles.css';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const ScoreBoard = () => {
  const [scoreBoard] = useLocalStorage('cinephiliacSB');

  return (
    <section id="scores" className="">
      {/* <!-- Box office table --> */}
      <table id="box-office-table" className="score-table">
        <thead>
          <tr>
            <th colSpan="3">
              <h2>💲Box Office💲</h2>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>Score</td>
            <td>Genre</td>
          </tr>
          {scoreBoard
            .filter((scoreData) => scoreData.gameMode === 'Box-Office')
            .map((scoreData) => {
              return (
                <tr key={scoreData.id}>
                  <td>{scoreData.username}</td>
                  <td>{scoreData.score}</td>
                  <td>{scoreData.gameGenre}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* <!-- End of box office table --> */}
      {/* <!-- Ratings table --> */}
      <table id="ratings-table" className="score-table">
        <thead>
          <tr>
            <th colSpan="3">
              <h2>⭐Ratings⭐</h2>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>Score</td>
            <td>Filters</td>
          </tr>
          {scoreBoard
            .filter((scoreData) => scoreData.gameMode === 'Ratings')
            .map((scoreData) => {
              return (
                <tr key={scoreData.id}>
                  <td>{scoreData.username}</td>
                  <td>{scoreData.score}</td>
                  <td>{scoreData.gameGenre}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* <!-- End of ratings table --> */}
    </section>
  );
};

export default ScoreBoard;
