let board = Array(9).fill("");
/*
0|1|2
3|4|5
6|7|8
*/
let gameActive = true;
const human = "X";
const ai = "O";

const boardElem = document.getElementById("board");

function renderBoard() {
  boardElem.innerHTML = "";
  board.forEach((cell, idx) => {
    const cellElem = document.createElement("div");
    cellElem.className = "cell";
    cellElem.addEventListener("click", () => handleCellClick(idx));
    cellElem.textContent = cell;
    boardElem.appendChild(cellElem);
  });
}

function handleCellClick(idx) {
  if (!gameActive || board[idx] || getCurrentPlayer() !== human) return;
  board[idx] = human;
  renderBoard();
}

function getCurrentPlayer() {
  const XCount = board.filter((c) => c === "X").length;
  const OCount = board.filter((c) => c === "O").length;
  return XCount === OCount ? human : ai;
}

renderBoard();

function checkWinner(player, testBoard = board) {
  /*
    0|1|2
    3|4|5
    6|7|8
    */

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
  
//   true or false 
  return winPatterns.some(
    // one of the winPatterns match
    (test) =>
      // all in the arry match with player "o" "X"
      test.every((idx) => testBoard[idx] === player)
  );
}
