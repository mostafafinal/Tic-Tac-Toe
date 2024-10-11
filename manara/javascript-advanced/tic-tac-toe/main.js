// gameboard
const GameBoard = (function () {
  const row = 3;
  const column = 3;
  const board = [];

  for (let i = 0; i < row; i++) {
    board[i] = [];

    for (let j = 0; j < column; j++) {
      board[i].push("");
    }
  }
  return { board };
})();

// players
function Players() {
  const playerOne = (() => {
    const symbol = "X";
    let score = 0;
    const getScore = () => score;
    const giveScore = () => score++;
    return { symbol, getScore, giveScore };
  })();

  const playerTwo = (() => {
    const symbol = "O";
    let score = 0;
    const getScore = () => score;
    const giveScore = () => score++;
    return { symbol, getScore, giveScore };
  })();

  return {
    playerOne,
    playerTwo,
  };
}
