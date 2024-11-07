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
const hsModal = document.querySelector(".hs-modal");
const closeButton = document.querySelector(".close-button");
const hsCloseButton = document.querySelector(".hs-close-button");
const homepage = document.querySelector(".homepage");
const scoreTable = document.querySelector(".score-table");
const main = document.querySelector("main");
let scoreboard = []

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  } else if (event.target === hsModal) {
    hsModal.classList.remove("show-modal")
  }
}

closeButton.addEventListener("click", toggleModal);
// hsCloseButton.addEventListener("click", () => hsModal.classList.remove("show-modal"))
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
let moves = document.querySelector('#movesCount');
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
  newGameButton2.classList.add("hideElements")
  backToHomeBtn.classList.add("hideElements")
  submitBtn.classList.remove("hideElements")
  const stats = document.querySelector(".stats");
  stats.textContent = "You won in " + movesCounter + " moves with time: " + s + "." + (ms % 100) + "s";
}

function updateMoveCounter() {
  movesCounter++;
  moves.textContent = movesCounter;
}

let ms = 0;
let s = 0;
function timer() {
  ++ms;
  s = Math.floor(ms / 100);
  let timer = document.querySelector(".timer");
    timer.textContent = s + "." + (ms % 100) + "s";
}

let home = document.querySelector("#home-nav");
home.addEventListener("click", backToHome, false);
function backToHome() {
  modal.classList.remove('show-modal');
  homepage.classList.remove('hideElements');
  scoreTable.classList.add('hideElements');
  updateHighscoreTable();
  main.classList.add('hideElements');
}

let restart = document.querySelector("#repeat-nav");
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
  timer.textContent = "0.00s";
  moves.textContent = movesCounter;
  initGame();
}

let newGameButton1 = document.querySelector("#new-game-btn");
newGameButton1.addEventListener("click", newGame);

let newGameButton2 = document.querySelector("#new-game-btn2");
newGameButton2.addEventListener("click", newGame);

function newGame() {
  modal.classList.remove('show-modal');
  homepage.classList.add('hideElements');
  scoreTable.classList.remove('hideElements');
  main.classList.remove('hideElements');
  restartGame();
}

let submitBtn = document.querySelector("#submitBtn")
submitBtn.addEventListener("click", () => {
  let nameInputDiv = document.querySelector("#name-input-div")
  localStorage.setItem(nameInput.value, [movesCounter, ms])
  newGameButton2.classList.remove("hideElements")
  backToHomeBtn.classList.remove("hideElements")
  submitBtn.classList.add("hideElements")
  nameInputDiv.classList.add("hideElements")
})

let backToHomeBtn = document.querySelector("#back-to-home")
backToHomeBtn.addEventListener("click", backToHome)

function updateHighscoreTable(){
  updateHighscore()
  for(i=1; i<=5; i++){
    rowHTML = document.querySelector(`.row${i}`)
    if(scoreboard[i-1]){
      rowHTML.children[1].innerHTML = scoreboard[i-1][0]
      rowHTML.children[4].innerHTML = scoreboard[i-1][1]
      let time = scoreboard[i-1][2]/100
      rowHTML.children[2].children[0].classList.remove("hideElements")
      rowHTML.children[3].innerHTML = time.toFixed(2) + 's'
    }
  }
}

function updateHighscore(){
  scoreboard = []
  keys = Object.keys(localStorage)
  for(i=0; i<keys.length; i++){
    scoreboard.push([keys[i],...localStorage.getItem(keys[i]).split(',')])
  }
  scoreboard.sort((a,b) => {
    return (a[2] - b[2])
  })
}

function clearLocalStorage(){
  localStorage.clear
}

// clearLocalStorage()
initGame();
updateHighscoreTable();
