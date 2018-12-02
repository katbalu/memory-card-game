//globals
const deckOfCards = document.querySelector('.deck');
let flippedCards = [];
let moves = 0;
const timer = document.querySelector('.timer');
let second = 0,
    minute = 0;
let matched = 0;
let interval;
let clockOff = true;
let time = 0;
const total_pairs = 8;
const stars = document.querySelectorAll('.stars li');


//Array to hold all cards
const playingCards = ['fa fa-diamond', 'fa fa-diamond',
                      'fa fa-bomb', 'fa fa-bomb',
                      'fa fa-bolt', 'fa fa-bolt',
                      'fa fa-bicycle', 'fa fa-bicycle',
                      'fa fa-anchor', 'fa fa-anchor',
                      'fa fa-cube', 'fa fa-cube',
                      'fa fa-leaf', 'fa fa-leaf',
                      'fa fa-paper-plane-o', 'fa fa-paper-plane-o'];

//Display cards

function createCards(card) {
    return `<li class="card"><i class="fa ${card}"></i></li>`;
}

function createGame() {
    const cardHTML = shuffle(playingCards).map(function (card) {
        return createCards(card);
    });
    deckOfCards.innerHTML = cardHTML.join('');
}

createGame();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//game play. includes functionality to flip cards, match cards, and calls functions to count moves, lower star rating based on move count, and end game based on correct amount of matched pairs.

deckOfCards.addEventListener('click', function (event) {
    const clickTarget = event.target;
    if (clickTarget.classList.contains('card') && flippedCards.length < 2 && !flippedCards.includes(clickTarget)) {
        flipCardsOver(clickTarget);
        addFlippedCards(clickTarget);
        if (flippedCards.length === 2) {
            cardMatch(clickTarget);
            moveCounter();
            starRating();
        }
        if (clockOff) {
            startTimer();
            clockOff = false;
        }
        if (matched === total_pairs) {
            gameOver();
        }
    }
});

function flipCardsOver(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addFlippedCards(clickTarget) {
    flippedCards.push(clickTarget);
}

function cardMatch() {
    if (flippedCards[0].firstElementChild.className ===
        flippedCards[1].firstElementChild.className) {
        flippedCards[0].classList.add('match');
        flippedCards[1].classList.add('match');
        flippedCards = [];
        matched++;
    } else {
        setTimeout(() => {
            flipCardsOver(flippedCards[0]);
            flipCardsOver(flippedCards[1]);
            flippedCards = [];
        }, 1000);
    }
}


//counting game moves. 2 flipped cards counts as single move.

function moveCounter() {
    moves++;
    const counter = document.querySelector('.moves');
    counter.innerHTML = moves;
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}


// Star Rating

function getStars() {
    starCount = 0;
    for (star of stars) {
        if (star.style.visibility !== 'collapse') {
            starCount++;
        }
    }
    return starCount;
}

//lowers star rating based on moves
function starRating() {
    if (moves === 10 || moves === 20) {
        for (star of stars) {
            if (star.style.visibility !== 'collapse') {
                star.style.visibility = 'collapse';
                break;
            }
        };
    }
}

function resetStars() {
    for (star of stars) {
        star.style.visibility = 'visible';
    }
}


// Game Timer
function startTimer() {
    let second = 0,
        minute = 0;
    interval = setInterval(function () {
        timer.innerHTML = `${minute} min ${second} secs`;
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    clockOff = true;
}

function resetTimer() {
    stopTimer();
    timer.innerHTML = `${minute} min ${second} secs`;
}

//ending & restarting game
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

function restartGame() {
    matched = 0;
    resetTimer();
    resetMoves();
    resetCards();
    resetStars();
}

function gameOver() {
    stopTimer();
    writeModalMessage();
    toggleModal();
}

//restart button
document.querySelector('.restart').addEventListener('click', restartGame);


//modal
function toggleModal() {
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}

function writeModalMessage() {
    const clockTime = document.querySelector('.timer').innerHTML;
    const stars = getStars();
    const winStats = document.querySelector('.modal_winStats');
    winStats.innerHTML = `You won in ${clockTime},<br>with ${moves} moves & ${stars} stars!`;
}

document.querySelector('.modal_replay').addEventListener('click', function resetGame() {
    restartGame();
    toggleModal();
});
