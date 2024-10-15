function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}

const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
      toggleModal();
  }
}

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

let cardTest = [];
let cards = 
  ["sanofi", "sanofi", 
  "plavix", "plavix", 
  "aprovel", "aprovel", 
  "coaprovel", "coaprovel", 
  "coplavix", "coplavix", 
  "aprovasc", "aprovasc"];

let shuffledCards = shuffle(cards);

function createCards() {
  for (let card of shuffledCards) {
      const li = document.createElement("LI");
      li.classList.toggle("card");
      const img = document.createElement("img");
      img.src = "assets/" + card + "-logo.png";
      img.classList.toggle("logo");
      li.appendChild(img);
    
      const deck = document.querySelector('.deck');
      deck.appendChild(li);
  }
}

const ul = document.querySelector('.deck');
let moves = document.querySelector('.moves');
let movesCounter = 0;
let match = 0;
let isfirstClick = true;
let timerID;
let isRestart = false;

function initGame() {
  createCards();
  const card = document.querySelectorAll('.card');
  for (let i = 0; i < card.length; i++) {
      card[i].addEventListener("click", function (event) {
          if (card[i] !== event.target) return;
          if (event.target.classList.contains("show")) return;
          if (isfirstClick) {
              timerID = setInterval(timer, 10);
              isfirstClick = false;
          }
          showCard(event.target);
          setTimeout(addCard, 550, shuffledCards[i], event.target, cardTest, i);
      }, false);
  }
}

function showCard(card) {
  card.classList.add('show');
}

function addCard(card, cardHTML, testList, pos) {
  if (isRestart) {
      testList.length = 0;
      isRestart = false;
  }
  testList.push(card);
  testList.push(cardHTML)
  testList.push(pos);
  if (testList.length === 6) {
      updateMoveCounter();
      testCards(testList[0], testList[1], testList[2], testList[3], testList[4], testList[5]);
      testList.length = 0;
  }
}

function testCards(card1, html1, x1, card2, html2, x2) {
  if (card1 === card2 && x1 != x2) {
      cardsMatch(html1, html2);
  } else {
      cardsDontMatch(html1, html2);
  }
}

function cardsMatch(card1, card2) {
  card1.classList.add('match');
  card2.classList.add('match');
  match++;
  if (match === 6) {
      win();
  }
}

function cardsDontMatch(card1, card2) {
  card1.classList.toggle('no-match');
  card2.classList.toggle('no-match');
  setTimeout(function () {
      card1.classList.toggle('no-match');
      card2.classList.toggle('no-match');
      card1.classList.toggle('show');
      card2.classList.toggle('show');
  }, 300);
}

function win() {
  clearInterval(timerID);
  toggleModal();
  const stats = document.querySelector(".stats");
  stats.textContent = "You won in " + movesCounter + " moves with time: " + m + ":0" + s % 60;
}

function updateMoveCounter() {
  movesCounter++;
  moves.textContent = "Moves: " + movesCounter;
}

let ms = 0;
let s = 0;
function timer() {
  ++ms;
  s = Math.floor(ms / 100);
  let timer = document.querySelector(".timer");
  timer.textContent = "Elapsed Time: " + s + "." + (ms % 100) + "s";
}

let restart = document.querySelector(".navLogo:nth-child(1)");
restart.addEventListener("click", restartGame, false);
function restartGame() {
  clearInterval(timerID);
  movesCounter = 0;
  match = 0;
  ms = 0;
  s = 0;
  isfirstClick = true;
  isRestart = true;
  const deck = document.querySelector('.deck');
  var elements = deck.getElementsByClassName('card');

  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }
  shuffledCards = shuffle(cards);
  let timer = document.querySelector(".timer");
  timer.textContent = "Elapsed Time: 00.00s";
  moves.textContent = "Moves: " + movesCounter;
  initGame();
}

let home = document.querySelector(".navLogo:nth-child(2)");
home.addEventListener("click", restartGame, false);

let newGameButton = document.querySelectorAll(".new-game");
console.log(newGameButton)
newGameButton.addEventListener("click", newGame);
function newGame() {
  toggleModal();
  restartGame();
}

initGame();
