const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');

const WINS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

let board, gameOver;

function init() {
  board = Array(9).fill('');
  gameOver = false;
  cells.forEach(c => {
    c.textContent = '';
    c.disabled = false;
    c.classList.remove('win');
  });
  status.textContent = 'Your turn (X)';
}

function checkWinner(b, player) {
  return WINS.find(combo => combo.every(i => b[i] === player)) || null;
}

function isDraw(b) {
  return b.every(cell => cell !== '');
}

function minimax(b, isMaximizing) {
  if (checkWinner(b, 'O')) return 10;
  if (checkWinner(b, 'X')) return -10;
  if (isDraw(b)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    b.forEach((cell, i) => {
      if (cell === '') {
        b[i] = 'O';
        best = Math.max(best, minimax(b, false));
        b[i] = '';
      }
    });
    return best;
  } else {
    let best = Infinity;
    b.forEach((cell, i) => {
      if (cell === '') {
        b[i] = 'X';
        best = Math.min(best, minimax(b, true));
        b[i] = '';
      }
    });
    return best;
  }
}

function aiMove() {
  let bestScore = -Infinity, bestIndex = -1;
  board.forEach((cell, i) => {
    if (cell === '') {
      board[i] = 'O';
      const score = minimax(board, false);
      board[i] = '';
      if (score > bestScore) { bestScore = score; bestIndex = i; }
    }
  });
  return bestIndex;
}

function highlight(combo) {
  combo.forEach(i => cells[i].classList.add('win'));
}

function handleClick(e) {
  const i = parseInt(e.target.dataset.index);
  if (gameOver || board[i]) return;

  // Player move
  board[i] = 'X';
  cells[i].textContent = 'X';
  cells[i].disabled = true;

  const playerWin = checkWinner(board, 'X');
  if (playerWin) {
    highlight(playerWin);
    status.textContent = 'You win!';
    gameOver = true;
    cells.forEach(c => c.disabled = true);
    return;
  }
  if (isDraw(board)) {
    status.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  // AI move
  status.textContent = 'AI is thinking...';
  setTimeout(() => {
    const ai = aiMove();
    board[ai] = 'O';
    cells[ai].textContent = 'O';
    cells[ai].disabled = true;

    const aiWin = checkWinner(board, 'O');
    if (aiWin) {
      highlight(aiWin);
      status.textContent = 'AI wins!';
      gameOver = true;
      cells.forEach(c => c.disabled = true);
      return;
    }
    if (isDraw(board)) {
      status.textContent = "It's a draw!";
      gameOver = true;
      return;
    }
    status.textContent = 'Your turn (X)';
  }, 300);
}

cells.forEach(c => c.addEventListener('click', handleClick));
restartBtn.addEventListener('click', init);

init();
