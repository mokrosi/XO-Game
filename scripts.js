const boardElem = document.getElementById("board");
const statusElem = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const consolList = document.getElementById("consolList");

let board = Array(9).fill("");
let gameActive = true;
const human = "X",
  ai = "O";

function log(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  consolList.appendChild(li);
  consolList.scrollTop = consolList.scrollHeight;
}

function renderBoard() {
  //   consolList.innerHTML = "";
  boardElem.innerHTML = "";
  board.forEach((cell, idx) => {
    const cellElem = document.createElement("div");
    cellElem.className = "cell";
    cellElem.textContent = cell;
    cellElem.addEventListener("click", () => handleCellClick(idx));
    boardElem.appendChild(cellElem);
  });
}

function handleCellClick(idx) {
  if (!gameActive || board[idx] || getCurrentPlayer() !== human) return;
  board[idx] = human;
  renderBoard();
  if (checkWinner(human)) {
    statusElem.textContent = `You win!`;
    gameActive = false;
  } else if (board.every((cell) => cell)) {
    statusElem.textContent = "It's a draw!";
    gameActive = false;
  } else {
    statusElem.textContent = "AI's turn (O)";
    aiMove(); // Call directly, no delay
  }
}

async function aiMove() {
  if (!gameActive) return;

  const li = document.createElement("li");
  li.textContent = "AI is thinking...";
  consolList.appendChild(li);

  const move = await getBestMoveVisual(board.slice(), ai);

  if (move !== null) {
    board[move] = ai;
    renderBoard();
    if (checkWinner(ai)) {
      statusElem.textContent = `AI wins!`;
      gameActive = false;
    } else if (board.every((cell) => cell)) {
      statusElem.textContent = "It's a draw!";
      gameActive = false;
    } else {
      statusElem.textContent = "Your turn (X)";
    }
  }
}

async function getBestMoveVisual(b, player) {
  const li = document.createElement("li");
  li.textContent = "check Empty Cell";
  consolList.appendChild(li);

  log("AI is searching for the best move...");

  const emptyCells = b
    .map((cell, i) => (cell ? null : i))
    .filter((i) => i !== null);

  const li1 = document.createElement("li");
  li1.textContent = "Empty Cell {" + emptyCells + "}";
  consolList.appendChild(li1);

  let bestScore = -Infinity,
    move = null;
  for (let i of emptyCells) {
    b[i] = ai;
    renderBoard();
    let score = await minimaxVisual(b, 0, false);
    b[i] = "";
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }

  log("try Every Move Possible");
  log("AI finished evaluating all possible moves.");

  return move;
}

function getCurrentPlayer() {
  const xCount = board.filter((c) => c === "X").length;
  const oCount = board.filter((c) => c === "O").length;
  return xCount === oCount ? human : ai;
}

function checkWinner(player, testBoard = board) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some((pattern) =>
    pattern.every((idx) => testBoard[idx] === player)
  );
}

// Visualized Minimax: highlights checked positions
async function minimaxVisual(b, depth, isMaximizing) {
  if (checkWinner(ai, b)) return 10 - depth;
  if (checkWinner(human, b)) return depth - 10;
  if (b.every((cell) => cell)) return 0;

  const emptyCells = b
    .map((cell, i) => (cell ? null : i))
    .filter((i) => i !== null);

  if (isMaximizing) {
    let best = -Infinity;
    for (let i of emptyCells) {
      b[i] = ai;
      //   await sleep(10); // minor pause for visualization
      let score = await minimaxVisual(b, depth + 1, false);
      b[i] = "";
      best = Math.max(best, score);
    }
    return best;
  } else {
    let best = Infinity;
    for (let i of emptyCells) {
      b[i] = human;
      //   await sleep(10); // minor pause for visualization
      let score = await minimaxVisual(b, depth + 1, true);
      b[i] = "";
      best = Math.min(best, score);
    }
    return best;
  }
}

resetBtn.addEventListener("click", () => {
  board = Array(9).fill("");
  gameActive = true;
  statusElem.textContent = `Your turn (X)`;
  consolList.innerHTML = "";

  renderBoard();
});

renderBoard();
