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
const header = document.querySelector(".header");
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
  [
    "alogo", "alogo", "alogo",
    "aans-1", "aans-2", "aans-3",
    "tlogo", "tlogo", "tlogo",
    "tans-1", "tans-2", "tans-3",
    "plogo", "plogo", "plogo",
    "pans-1", "pans-2", "pans-3"
  ];

let shuffledCards = shuffle(cards);

function createCards() {
  for (let card of shuffledCards) {
      const li = document.createElement("LI");
      li.classList.toggle("card");
      
      // map logos to cards
      switch (card) {
        case "alogo":
        case "tlogo":
        case "plogo":
          const img = document.createElement("img");
          img.src = "assets/" + card + ".png";
          img.classList.toggle("logo");
          li.appendChild(img);
          break;
      }

      // map answers to cards
      let answer;
      switch (card) {
        case "aans-1":
          answer = "Preferred ARB with early and late stage renal protection";
          break;
        case "aans-2":
          answer = "Reduces albuminuria";
          break;
        case "aans-3":
          answer = "Delays progression of diabetic nephropathy";
          break;
        case "tans-1":
          answer = "42% lesser nocturnal hypoglycemia";
          break;
        case "tans-2":
          answer = "Up to 36 hours action";
          break;
        case "tans-3":
          answer = "50% lesser glycemic variability";
          break;
        case "pans-1":
          answer = "plavix answer 1"
          break;
        case "pans-2":
          answer = "plavix answer 2"
          break;
        case "pans-3":
          answer = "plavix answer 3"
          break;
      }

      if (answer != undefined) {
        const text = document.createElement("div");
        text.innerText = answer;
        text.classList.toggle("answer-text");
        li.appendChild(text);
      }

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

function testCards(card1, html1, pos1, card2, html2, pos2) {
  switch (true) {
    case pos1 == pos2:
      cardsDontMatch(html1, html2);
      break;
    case card1 == "alogo" && /^aans/.test(card2):
    case card1 == "tlogo" && /^tans/.test(card2):
    case card1 == "plogo" && /^pans/.test(card2):
    case /^aans/.test(card1) && card2 == "alogo":
    case /^tans/.test(card1) && card2 == "tlogo":
    case /^pans/.test(card1) && card2 == "plogo":
      cardsMatch(html1, html2);
      break;
    default:
      cardsDontMatch(html1, html2);
      break;
  }
}

function cardsMatch(card1, card2) {
  card1.classList.add('match');
  card2.classList.add('match');
  match++;
  if (match === 9) {
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
  nameInputDiv.classList.remove("hideElements")
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
  header.classList.remove('hideElements');
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
  header.classList.add('hideElements');
  homepage.classList.add('hideElements');
  scoreTable.classList.remove('hideElements');
  main.classList.remove('hideElements');
  restartGame();
}

let submitBtn = document.querySelector("#submitBtn")
submitBtn.addEventListener("click", () => {
  let nameInput = document.querySelector("#name-input")
  let nameInputDiv = document.querySelector("#name-input-div")
  addGlobalHighscore(nameInput.value, movesCounter, ms)
  newGameButton2.classList.remove("hideElements")
  backToHomeBtn.classList.remove("hideElements")
  submitBtn.classList.add("hideElements")
  nameInputDiv.classList.add("hideElements")
})

let backToHomeBtn = document.querySelector("#back-to-home")
backToHomeBtn.addEventListener("click", backToHome)

function updateHighscoreTable(){
  for(i=1; i<=5; i++){
    rowHTML = document.querySelector(`.row${i}`)
    if(scoreboard[i-1]){
      // scoreboard[i][0]: name
      // scoreboard[i][1]: moves
      // scoreboard[i][2]: timing
      rowHTML.children[1].innerHTML = scoreboard[i-1][0]
      let time = scoreboard[i-1][2]/100
      rowHTML.children[2].children[0].classList.remove("hideElements")
      rowHTML.children[3].innerHTML = time.toFixed(2) + 's'
      rowHTML.children[4].innerHTML = scoreboard[i-1][1]
    }
  }
}

// Global Highscore
const BIN_ID = "6880a325ae596e708fba3ff9";
const DB_ENDPOINT = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`

function getGlobalHighscore(){
  fetch(DB_ENDPOINT)
  .then(res => res.json())
  .then(data => {
    scoreboard = data.record.scores;
  });
}

async function addGlobalHighscore(name, moves, timing) {
  if (scoreboard.length === 0) {
    getGlobalHighscore()
  }

  // Add new score in ascending order of timing
  scoreboard.push({
    name: name,
    moves: moves,
    timing: timing
  });
  scoreboard.sort((a,b) => a.timing - b.timing)

  // Save updated scores
  const putRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Bin-Versioning': 'false'
    },
    body: JSON.stringify({ scoreboard })
  });

  if (!putRes.ok) {
    console.error('Failed to add score');
  }
}

getGlobalHighscore()
.then(updateHighscoreTable());
initGame();