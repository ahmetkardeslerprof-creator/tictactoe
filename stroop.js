const COLORS = [
  { name: 'Kırmızı', hex: '#e74c3c' },
  { name: 'Mavi',    hex: '#3498db' },
  { name: 'Yeşil',   hex: '#2ecc71' },
  { name: 'Sarı',    hex: '#f1c40f' },
  { name: 'Mor',     hex: '#9b59b6' },
  { name: 'Turuncu', hex: '#e67e22' },
];

let score, level, timeLeft, timer, currentAnswer, answeredCount, locked;

const wordEl      = document.getElementById('word');
const scoreEl     = document.getElementById('score');
const levelEl     = document.getElementById('level');
const timerEl     = document.getElementById('timer');
const buttonsEl   = document.getElementById('buttons');
const feedbackEl  = document.getElementById('feedback');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const finalLevelEl = document.getElementById('final-level');

function getTimeForLevel(lvl) {
  // starts at 5s, minimum 1.5s
  return Math.max(1500, 5000 - (lvl - 1) * 300);
}

function getColorsForLevel(lvl) {
  // level 1-2: 3 colors, 3-4: 4, 5-6: 5, 7+: all 6
  if (lvl <= 2) return COLORS.slice(0, 3);
  if (lvl <= 4) return COLORS.slice(0, 4);
  if (lvl <= 6) return COLORS.slice(0, 5);
  return COLORS;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function nextQuestion() {
  if (locked) return;
  const pool = getColorsForLevel(level);

  // word text (what's written)
  const wordColor = pool[Math.floor(Math.random() * pool.length)];
  // ink color (must be different)
  let inkCandidates = pool.filter(c => c.name !== wordColor.name);
  const inkColor = inkCandidates[Math.floor(Math.random() * inkCandidates.length)];

  currentAnswer = inkColor.name;

  wordEl.textContent = wordColor.name;
  wordEl.style.color = inkColor.hex;

  // build buttons — always show pool colors shuffled
  buttonsEl.innerHTML = '';
  shuffle(pool).forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'color-btn';
    btn.textContent = c.name;
    btn.style.background = c.hex;
    btn.addEventListener('click', () => handleAnswer(c.name));
    buttonsEl.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = getTimeForLevel(level);
  timerEl.textContent = (timeLeft / 1000).toFixed(1) + 's';

  const interval = 100;
  timer = setInterval(() => {
    timeLeft -= interval;
    timerEl.textContent = (timeLeft / 1000).toFixed(1) + 's';
    if (timeLeft <= 0) {
      clearInterval(timer);
      showFeedback('Süre doldu!', false);
      endGame();
    }
  }, interval);
}

function handleAnswer(chosen) {
  if (locked) return;
  clearInterval(timer);

  if (chosen === currentAnswer) {
    score++;
    answeredCount++;
    scoreEl.textContent = score;
    showFeedback('Doğru! +1', true);

    // level up every 5 correct answers
    if (answeredCount % 5 === 0) {
      level++;
      levelEl.textContent = level;
    }

    locked = true;
    setTimeout(() => { locked = false; nextQuestion(); }, 500);
  } else {
    showFeedback('Yanlış!', false);
    endGame();
  }
}

function showFeedback(msg, correct) {
  feedbackEl.textContent = msg;
  feedbackEl.className = correct ? 'correct' : 'wrong';
  setTimeout(() => { feedbackEl.textContent = ''; feedbackEl.className = ''; }, 500);
}

function endGame() {
  locked = true;
  clearInterval(timer);
  setTimeout(() => {
    finalScoreEl.textContent = score;
    finalLevelEl.textContent = level;
    gameOverScreen.classList.remove('hidden');
  }, 600);
}

function startGame() {
  score = 0;
  level = 1;
  answeredCount = 0;
  locked = false;
  scoreEl.textContent = 0;
  levelEl.textContent = 1;
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  nextQuestion();
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
