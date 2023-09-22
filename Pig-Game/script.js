'use strict';

// Constants
const WINNING_SCORE = 100;

// Elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

const score0El = document.querySelector('#score--0'); // # is for id
const score1El = document.getElementById('score--1'); // getElementById is faster than querySelector

const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');

const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores, currentScore, activePlayer, isGameFinished;

// Functions
const hideDice = function () {
  diceEl.classList.add('hidden');
};

const setDice = function (dice) {
  diceEl.classList.remove('hidden');
  diceEl.src = `dice-${dice}.png`;
};

const setCurrentScore = function (player, score) {
  document.getElementById(`current--${player}`).textContent = score;
};

const setScore = function (player, score) {
  document.getElementById(`score--${player}`).textContent = score;
};

const setWinner = function (player) {
  document
    .querySelector(`.player--${player}`)
    .classList.remove('player--active');

  document.querySelector(`.player--${player}`).classList.add('player--winner');
};

const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  isGameFinished = false;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  hideDice();

  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');

  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};

const switchPlayer = function () {
  currentScore = 0;
  setCurrentScore(activePlayer, currentScore);

  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active'); // toggle adds class if it's not there, and removes if it is
  player1El.classList.toggle('player--active');
};

const rollDice = function () {
  if (isGameFinished) {
    return;
  }

  const dice = Math.trunc(Math.random() * 6) + 1; // 1-6

  setDice(dice);

  if (dice !== 1) {
    currentScore += dice;
    setCurrentScore(activePlayer, currentScore);
  } else {
    switchPlayer();
  }
};

const holdScore = function () {
  if (isGameFinished) {
    return;
  }

  scores[activePlayer] += currentScore;
  setScore(activePlayer, scores[activePlayer]);

  if (scores[activePlayer] >= WINNING_SCORE) {
    isGameFinished = true;
    setWinner(activePlayer);
    hideDice();
  } else {
    switchPlayer();
  }
};

// Initialization
init();

// Event handlers
btnRoll.addEventListener('click', rollDice);

btnHold.addEventListener('click', holdScore);

btnNew.addEventListener('click', init);
