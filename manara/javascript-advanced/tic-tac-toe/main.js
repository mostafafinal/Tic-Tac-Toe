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

  let rounds = 1;
  let activePlayer = playerOne;

  const playRounds = () => {
    if (rounds < 3) {
      rounds++;
      board = GameBoard.board.map((row) => [...row]);
      return "Next Round";
    }
  };

  const playGame = (row, column) => {
    if (board[row][column] == "") {
      board[row][column] = activePlayer.token;
      const gameStatus = checkWinner();
      if (gameStatus === "continue") {
        switchTurns();
      }
      return gameStatus;
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
      return `Player ${activePlayer.token} Wins!`;
    }
    if (checkDraw) {
      return "Draw!";
    }

    return "continue";
  };

  const switchTurns = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const getRounds = () => rounds;
  const getActivePlayer = () => activePlayer;
  const getBoard = () => board;

  return {
    playGame,
    playRounds,
    getBoard,
    getActivePlayer,
    getRounds,
    playerOne,
    playerTwo,
  };
}

function DisplayController() {
  const game = GameController();

  const currPlayer = document.querySelector(".active-player");
  const round = document.createElement("button");
  round.className = "play";
  round.textContent = "Next Round";
  const winningMessage = document.createElement("div");
  winningMessage.className = "overlay";

  const gameContainer = document.querySelector(".container");
  const playerOneDOM = document.querySelector(".player-one");
  const playerTwoDOM = document.querySelector(".player-two");
  const playerOneScoreDOM = document.querySelector(".player-one-score");
  const playerTwoScoreDOM = document.querySelector(".player-two-score");

  const roundsDOM = document.querySelector(".rounds");
  const boardDOM = document.querySelector(".game-board");

  const updateScreen = () => {
    boardDOM.innerHTML = "";
    game.getBoard().forEach((row, i) => {
      row.forEach((_, j) => {
        const token = document.createElement("button");
        token.className = "token";
        token.dataset.row = i;
        token.dataset.column = j;
        token.textContent = game.getBoard()[i][j];
        boardDOM.append(token);
      });
    });

    currPlayer.textContent = `Player: ${game.getActivePlayer().token}`;

    playerOneDOM.textContent = game.playerOne.token;
    playerTwoDOM.textContent = game.playerTwo.token;
    playerOneScoreDOM.textContent = game.playerOne.getScore();
    playerTwoScoreDOM.textContent = game.playerTwo.getScore();

    roundsDOM.textContent = `Rounds: ${game.getRounds()}`;
  };

  boardDOM.addEventListener("click", handleBoardClick);
  round.addEventListener("click", handleRounds);

  function handleBoardClick(e) {
    let row = e.target.dataset.row;
    let column = e.target.dataset.column;
    const playGame = game.playGame(row, column);
    console.log(playGame);

    e.target.textContent = game.getActivePlayer().token;
    updateScreen();
    if (playGame !== "continue" && game.getRounds() == 3) {
      checkFinalWinner();
    }
  }

  function handleRounds() {
    const playRounds = game.playRounds();
    console.log(playRounds);
    updateScreen();
  }

  function checkFinalWinner() {
    if (game.playerOne.getScore() > game.playerTwo.getScore()) {
      winningMessage.textContent = `Player ${game.playerOne.token} Is The Final Winner!`;
    } else if (game.playerTwo.getScore() > game.playerOne.getScore()) {
      winningMessage.textContent = `Player ${game.playerTwo.token} Is The Final Winner!`;
    } else {
      winningMessage.textContent = "Draw!";
    }

    document.body.prepend(winningMessage);
    setTimeout(() => {
      winningMessage.remove();
    }, 2000);
    round.remove();
    gameContainer.append(play);
  }

  play.remove();
  gameContainer.append(round);
  // initial rendering
  updateScreen();
}

const play = document.querySelector(".play");
play.addEventListener("click", DisplayController);
