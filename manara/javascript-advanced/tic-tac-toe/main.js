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
    const token = "X";
    let score = 0;
    const getScore = () => score;
    const giveScore = () => score++;
    return { token, getScore, giveScore };
  })();

  const playerTwo = (() => {
    const token = "O";
    let score = 0;
    const getScore = () => score;
    const giveScore = () => score++;
    return { token, getScore, giveScore };
  })();

  return {
    playerOne,
    playerTwo,
  };
}

// game controller
function GameController() {
  const playerOne = Players().playerOne;
  const playerTwo = Players().playerTwo;
  const board = GameBoard.board;

  let rounds = 3;
  let activePlayer = playerOne.token;

  const playRounds = () => {
    if (rounds) {
      rounds--;
      playGame();
    }
    if (playerOne.getScore() > playerTwo.getScore()) {
      return `Player ${playerOne.token} Is The Final Winner!`;
    } else if (playerTwo.getScore() > playerOne.getScore()) {
      return `Player ${playerTwo.token} Is The Final Winner!`;
    } else {
      return "Draw!";
    }
  };

  const playGame = (row, column) => {
    if (board[row][column] == "") {
      board[row][column] = activePlayer;
      checkWinner();
    } else {
      playGame();
    }
  };

  const checkWinner = () => {
    const columns = [];
    const ties = [];
    for (let i = 0; i < board.length; i++) {
      const mainArr = board.map((item) => item[i]);
      columns.push(mainArr);
    }
    ties.push(board.map((item, index) => item[index]));
    ties.push(board.reverse().map((item, index) => item[index]));

    const checkRows = board.some((row) =>
      row.every((token) => token == activePlayer)
    );
    const checkColumns = columns.some((column) =>
      column.every((token) => token == activePlayer)
    );
    const checkTies = ties.some((tie) => tie.every((token) => token == "X"));
    const checkDraw = board
      .flat()
      .every((token) => token == playerOne.token || token == playerTwo.token);

    if (checkRows || checkColumns || checkTies) {
      return `Player ${activePlayer} Wins!`;
    }
    if (checkDraw) {
      return "Draw!";
    }

    switchTurns();
    playGame();
  };

  const switchTurns = () => {
    activePlayer == playerOne.token
      ? (activePlayer = playerTwo.token)
      : (activePlayer = playerOne.token);
  };

  return { playGame, activePlayer };
}
