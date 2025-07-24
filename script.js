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
const nameInput = document.querySelector("#name-input")
const nameInputDiv = document.querySelector("#name-input-div")

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
window.addEventListener("click", windowOnClick);

let cardTest = [];
let cards = 
  [
    "alogo1", "alogo2", "alogo3",
    "aans-1", "aans-2", "aans-3",
    "tlogo1", "tlogo2", "tlogo3",
    "tans-1", "tans-2", "tans-3",
    "plogo1", "plogo2", "plogo3",
    "pans-1", "pans-2", "pans-3"
  ];

let shuffledCards = shuffle(cards);

function createCards() {
  for (let card of shuffledCards) {
      const li = document.createElement("LI");
      li.classList.toggle("card");
      
      // map logos to cards
      if (card.includes("logo")) {
        const img = document.createElement("img");
        img.src = "assets/" + card.slice(0, -1) + ".png";
        img.classList.toggle("logo");
        li.appendChild(img);

        let imgText = ""
        switch (card) {
          case "alogo1":
            imgText = "IRMA-2";
            break;
          case "alogo2":
            imgText = "IDNT";
            break;
          case "alogo3":
            imgText = "eGFR";
            break;
          case "plogo1":
            imgText = "CAPRIE";
            break;
          case "plogo2":
            imgText = "HOST-EXAM";
            break;
          case "plogo3":
            imgText = "DAPT";
            break;
          case "tlogo1":
            imgText = "EDITION";
            break;
          case "tlogo2":
            imgText = "PKPD";
            break;
          case "tlogo3":
            imgText = "Dosing";
            break;
        }

        let imgTextDiv = document.createElement("div");
        imgTextDiv.innerText = imgText
        imgTextDiv.classList.toggle("logo-text")
        li.appendChild(imgTextDiv)
      }

      // map answers to cards
      let answer;
      switch (card) {
        case "aans-1":
          answer = "~70% reduction in nephropathy progression at 300mg";
          break;
        case "aans-2":
          answer = "~20-30% lower risk of renal endpoints vs placebo/amlodipine";
          break;
        case "aans-3":
          answer = "Slows decline of eGFR, preserving kidney function";
          break;
        case "tans-1":
          answer = "30-40% less noctunal hypoglycemia";
          break;
        case "tans-2":
          answer = "Up to 36 hours, flatter profile";
          break;
        case "tans-3":
          answer = "±3 hours dosing flexibility without efficacy loss";
          break;
        case "pans-1":
          answer = "Reduce vascular events more than Aspirin"
          break;
        case "pans-2":
          answer = "Reduce bleeding vs Aspirin"
          break;
        case "pans-3":
          answer = "Class IA for 12-month DAPT post-ACS"
          break;
      }

      if (answer != undefined) {
        // const text = document.createElement("div");
        // text.innerText = answer;
        // text.classList.toggle("answer-text");
        // li.appendChild(text);
        li.innerText = answer;
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
    case card1[0] === card2[0] && card1[card1.length-1] === card2[card2.length-1]:
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
  }, 350);
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
submitBtn.addEventListener("click", async () => {
  newGameButton2.classList.remove("hideElements")
  backToHomeBtn.classList.remove("hideElements")
  submitBtn.classList.add("hideElements")
  nameInputDiv.classList.add("hideElements")
  await addGlobalHighscore(nameInput.value, movesCounter, ms)
})

let backToHomeBtn = document.querySelector("#back-to-home")
backToHomeBtn.addEventListener("click", backToHome)

let scoreboard = []
function updateHighscoreTable(){
  for(i=1; i<=5; i++){
    rowHTML = document.querySelector(`.row${i}`)
    score = scoreboard[i-1]
    if(score){
      rowHTML.children[1].innerHTML = score.name
      let time = score.timing/100
      rowHTML.children[2].children[0].classList.remove("hideElements")
      rowHTML.children[3].innerHTML = time.toFixed(2) + 's'
      rowHTML.children[4].innerHTML = score.moves
    }
  }
}

// Global Highscore
const BIN_ID = "6880a325ae596e708fba3ff9";
const DB_ENDPOINT = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`

function getGlobalHighscore(){
  return fetch(DB_ENDPOINT)
  .then(res => res.json())
  .then(data => {
    scoreboard = data.record.scoreboard || [];
    console.log("Successfully fetched scoreboard: ", scoreboard)
    return scoreboard
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
.then(updateHighscoreTable);
initGame();