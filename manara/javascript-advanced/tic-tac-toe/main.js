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
  //   const board = GameBoard.board;
  //   let board = GameBoard.board
  let board = GameBoard.board.map((row) => [...row]);

  let rounds = 1;
  let activePlayer = playerOne;

  const playRounds = () => {
    while (rounds) {
      console.log(board);
      rounds--;
      //   let board = GameBoard.board.map((row) => [...row]);
      console.log(board);
      playGame();
    }
    if (playerOne.getScore() > playerTwo.getScore()) {
      console.log(`Player ${playerOne.token} Is The Final Winner!`);
      return;
      //   return `Player ${playerOne.token} Is The Final Winner!`;
    } else if (playerTwo.getScore() > playerOne.getScore()) {
      console.log(`Player ${playerTwo.token} Is The Final Winner!`);
      return;
      //   return `Player ${playerTwo.token} Is The Final Winner!`;
    } else {
      console.log("Draw");
      return;
      //   return "Draw!";
    }
  };

  const playGame = () => {
    const row = prompt("Row: ");
    const column = prompt("Column: ");
    if (board[row][column] == "") {
      board[row][column] = activePlayer.token;
      console.log(board);
      checkWinner();
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
    ties.push([...board].reverse().map((item, index) => item[index]));

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
      activePlayer.giveScore();
      console.log(`Player ${activePlayer.token} Wins!`);
      return;
      //   return `Player ${activePlayer.token} Wins!`;
    }
    if (checkDraw) {
      console.log("Draw");
      return;
      //   return "Draw!";
    }

    switchTurns();
    playGame();
  };

  const switchTurns = () => {
    activePlayer == playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
    console.log(activePlayer.token);
  };

  return { playRounds, activePlayer };
}

const play = document.querySelector(".play");
play.addEventListener("click", DisplayController);

function DisplayController() {
  const game = GameController();
  const playerOne = game.playerOne;
  const playerTwo = game.playerTwo;
  let board = game.board;
  let rounds = game.rounds;

  const currPlayer = document.querySelector(".active-player");

  const playerOneDOM = document.querySelector(".player-one");
  const playerTwoDOM = document.querySelector(".player-two");
  const playerOneScoreDOM = document.querySelector(".player-one-score");
  const playerTwoScoreDOM = document.querySelector(".player-two-score");
  playerOneDOM.textContent = playerOne.token;
  playerTwoDOM.textContent = playerTwo.token;

  const roundsDOM = document.querySelector(".rounds");
  const boardDOM = document.querySelector(".game-board");

  const updateScreen = () => {
    boardDOM.innerHTML = "";
    board.forEach((row, i) => {
      row.forEach((_, j) => {
        const token = document.createElement("button");
        token.className = "token";
        token.dataset.row = i;
        token.dataset.column = j;
        token.textContent = board[i][j];
        boardDOM.append(token);
      });
    });

    currPlayer.textContent = `Player: ${game.activePlayer.token}`;

    playerOneScoreDOM.textContent = playerOne.getScore();
    playerTwoScoreDOM.textContent = playerTwo.getScore();

    roundsDOM.textContent = `Rounds: ${game.rounds}`;
  };

  boardDOM.addEventListener("click", handleBoardClick);

  function handleBoardClick(e) {
    let row = e.target.dataset.row;
    let column = e.target.dataset.column;
    console.log(game.activePlayer.token);
    game.playGame(row, column);
    updateScreen();
  }

  // initial rendering
  updateScreen();
}
