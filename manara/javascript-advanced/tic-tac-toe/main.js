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
  let board = GameBoard.board.map((row) => [...row]);

  let rounds = 3;
  let activePlayer = playerOne;

  const playRounds = () => {
    while (rounds) {
      rounds--;
      board = GameBoard.board.map((row) => [...row]);
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
      board[row][column] = activePlayer.token;
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
      row.every((token) => token == activePlayer.token)
    );
    const checkColumns = columns.some((column) =>
      column.every((token) => token == activePlayer.token)
    );
    const checkTies = ties.some((tie) =>
      tie.every((token) => token == activePlayer.token)
    );
    const checkDraw = board
      .flat()
      .every((token) => token == playerOne.token || token == playerTwo.token);

    if (checkRows || checkColumns || checkTies) {
      return `Player ${activePlayer.token} Wins!`;
    }
    if (checkDraw) {
      return "Draw!";
    }

    switchTurns();
    playGame();
  };

  const switchTurns = () => {
    activePlayer == playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
  };

  return { playRounds, activePlayer, playerOne, playerTwo, board, rounds };
}

const play = document.querySelector(".play");
play.addEventListener("click", DisplayController);

function DisplayController() {
  const playerOne = GameController().playerOne;
  const playerTwo = GameController().playerTwo;
  let board = GameController().board;
  let rounds = GameController().rounds;
  let activePlayer = GameController().activePlayer;

  const currPlayer = document.querySelector(".active-player");

  const playerOneDOM = document.querySelector(".player-one");
  const playerTwoDOM = document.querySelector(".player-two");
  const playerOneScoreDOM = document.querySelector(".player-one-score");
  const playerTwoScoreDOM = document.querySelector(".player-two-score");
  playerOneDOM.textContent = playerOne.token;
  playerTwoDOM.textContent = playerTwo.token;

  const roundsDOM = document.querySelector(".rounds");
  const boardDOM = document.querySelector(".game-board");
}
