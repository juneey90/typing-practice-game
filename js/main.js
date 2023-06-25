const RANDOM_WORD_API_ADDRESS =
  "https://random-word-api.herokuapp.com/word?number=100";
const GAME_TIME = 10;
const START_GAME = "게임시작";
const IN_GAME = "게임중";
const LOADING_GAME = "게임로딩중...";
let score = 95;
let time = GAME_TIME;
let isPlaying = false;
let checkInterVal;
let timeInterval;
let words;
let invisibleWords = document.querySelector("#invisible-words");
const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".output-window");
const scoreDisplay = document.querySelector(".score-value");
const timeDisplay = document.querySelector(".time-value");
const button = document.querySelector(".button");

const buttonChange = function (text) {
  button.innerText = text;
  [START_GAME, IN_GAME].includes(text)
    ? button.classList.remove("loading")
    : button.classList.add("loading");

  text === IN_GAME
    ? button.classList.add("in-game")
    : button.classList.remove("in-game");
};

function setPageLoad() {
  wordInput.disabled = true;
  wordInput.classList.add("loading");
  buttonChange(LOADING_GAME);
  getWords();
}

function init() {
  isPlaying = false;
  buttonChange(START_GAME);
  clearInterval(checkInterVal);
  clearInterval(timeInterval);
  wordInput.classList.add("loading");
  wordInput.placeholder = "";
  wordDisplay.innerText = "Click Start Game";
  wordInput.value = "";
  wordInput.disabled = true;
  scoreDisplay.innerText = "0";
  timeDisplay.innerText = "0";
}

function isVictory() {
  return score === 100 ? true : false;
}

function getWords() {
  axios
    .get(RANDOM_WORD_API_ADDRESS)
    .then(function (response) {
      words = Array.from(response.data).filter((word) => word.length < 10);
      invisibleWords = words;
      buttonChange(START_GAME);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {});
}

function checkStatus() {
  if (!isPlaying && time === 0) {
    alert("시간 초과로 게임이 종료되었습니다.");
    init();
  }

  if (isVictory()) {
    alert("축하합니다. 게임을 클리어 하셨습니다.");
    init();
  }
}

function checkMatch(e) {
  if (e.key !== "Enter") {
    return;
  }

  if (wordInput.value === wordDisplay.innerText) {
    wordInput.value = "";

    if (!isPlaying) {
      return;
    }
    score += 5;
    scoreDisplay.innerText = score; //++score;
    time = GAME_TIME;
    bindRandomWord();
  }
}

function bindRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  wordDisplay.innerText = words[randomIndex];
}

const countDown = function () {
  time > 0 ? time-- : (isPlaying = false);
  if (!isPlaying) {
    clearInterval(timeInterval);
  }
  timeDisplay.innerText = time;
};

const run = function () {
  if (isPlaying) {
    return;
  }
  isPlaying = true;
  time = GAME_TIME;
  timeDisplay.innerText = time;
  bindRandomWord();
  wordInput.disabled = false;
  wordInput.classList.remove("loading");
  wordInput.placeholder = "type here";
  wordInput.focus();
  scoreDisplay.innerText = 0;
  timeInterval = setInterval(countDown, 1000);
  checkInterVal = setInterval(checkStatus, 50);
  buttonChange(IN_GAME);
};

window.addEventListener("DOMContentLoaded", (event) => {
  setPageLoad();
  wordInput.addEventListener("keydown", (e) => {
    checkMatch(e);
  });
  button.addEventListener("click", run);
});
