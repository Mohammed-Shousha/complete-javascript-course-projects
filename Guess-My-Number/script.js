'use strict';

const messageElement = document.querySelector('.message');
const numberElement = document.querySelector('.number');
const scoreElement = document.querySelector('.score');
const highscoreElement = document.querySelector('.highscore');
const guessElement = document.querySelector('.guess');

const checkButton = document.querySelector('.check');
const againButton = document.querySelector('.again');

const generateRandomNumber = function () {
  return Math.trunc(Math.random() * 20) + 1;
};

let secretNumber = generateRandomNumber();

let score = 20;
let highscore = 0;
let isGameFinished = false;

const displayMessage = function (message) {
  messageElement.textContent = message;
};

const showWinningStyle = function () {
  document.querySelector('body').style.backgroundColor = '#60b347';
  document.querySelector('.number').style.width = '30rem';
};

const showBaseStyle = function () {
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
};

const updateScore = function (score) {
  scoreElement.textContent = score;
};

const decreaseScore = function () {
  score--;
  updateScore(score);
};

const updateHighscore = function (score) {
  highscore = score;
  highscoreElement.textContent = score;
};

const updateNumber = function (number) {
  numberElement.textContent = number;
};

const handleCheck = function () {
  const guess = Number(guessElement.value);

  if (!guess) {
    displayMessage('❌ No number!');
    return;
  }

  if (score <= 1) {
    displayMessage('💥 You lost the game!');
    updateScore(0);
    return;
  }

  if (guess === secretNumber) {
    displayMessage('🎉 Correct Number!');

    updateNumber(secretNumber);

    showWinningStyle();

    if (score > highscore) {
      updateHighscore(score);
    }

    isGameFinished = true;
  } else if (guess !== secretNumber && !isGameFinished) {
    displayMessage(guess > secretNumber ? '⬆️ Too high!' : '⬇️ Too low!');
    decreaseScore();
  }
};

const handleReset = function () {
  score = 20;
  secretNumber = generateRandomNumber();
  isGameFinished = false;

  updateScore(score);
  displayMessage('Start guessing...');
  updateNumber('?');
  guessElement.value = '';
  showBaseStyle();
};

checkButton.addEventListener('click', handleCheck);

againButton.addEventListener('click', handleReset);
