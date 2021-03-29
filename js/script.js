const commandEl = document.querySelector('.header__command');
const btnsEl = document.querySelectorAll('.btn--game');
const startEl = document.querySelector('.btn__main');
const gameOverEl = document.querySelector('.game-over');
const messageEl = document.getElementById('message');
const speedBtnsEl = document.querySelectorAll('.btn--speed');
const slowEl = document.querySelector('.slow');
const normalEl = document.querySelector('.normal');
const fastEl = document.querySelector('.fast');
const soundEl = document.querySelector('.mute');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const sounds = document.querySelectorAll('.sound');
const slow = 1000;
const normal = 700;
const fast = 400;

let userTurn = false;
let comp = [];
let user = [];
let chosenSpeed = normal;
let score = 0;
let sound = 'on';
let highScore = Number(localStorage.getItem('highScore'));

// listen to btns and flash
btnsEl.forEach(btn => btn.addEventListener('click', (e) => {
    if (userTurn) {
        const curr = e.target;
        curr.style.filter = "brightness(2)";
        setTimeout(()=>{
            curr.style.filter = "brightness(1)";
        }, 300);
    }
}));

//  TOGGLE SOUND
function toggleSound(e) {
    soundEl.classList.toggle("fa-volume-up");
    if (sound === 'on') {
        document.querySelectorAll('audio').forEach(el => {
            el.muted = true;
            sound = 'off';
        });
    } else if (sound === 'off') {
        document.querySelectorAll('audio').forEach(el => {
            el.muted = false;
            sound = 'on';
        });
    }
}        

// INITIATE COMPUTERS PATTERN
function getRandom() {
    const random = btnsEl [ Math.floor (Math.random () * btnsEl.length)];
    comp.push (random);
}

// FLASH CURRENT ITEM
function flash(item, index) {
    item.style.filter = "brightness(2)";
    setTimeout(()=>{
        item.style.filter = "brightness(1)";
    }, 250);

    // PLAY CORRESPONDING SOUND
    const currentElement = parseInt(item.id) - 1;
    sounds[currentElement].play();

    // UPDATE COMMAND WHEN SET IS OVER
    if (index === comp.length - 1) {
        setTimeout(()=> {
            updateCommand('play');
        }, 800);
    }
}

// ADD GAP BETWEEN FLASHES
function pause(item, index) {
    gap = index * chosenSpeed;
    setTimeout(() => {
        flash(item, index)
    }, gap);
}

// SHOW COMMAND
function updateCommand(command) {
    commandEl.innerHTML = `${command}!`;
}

// HIDE COMMAND
function removeCommand() {
    commandEl.innerHTML = '';
}


// LOOP THROUGH COMPUTERS PATTERN
function displayOrder() {
    for (i = 0; i < comp.length; i++) {
        pause(comp[i], i);
    }
    userTurn = true;
    }

    // STILL IN THE GAME
    function continueGame() {
    user = [];
    removeStartBtn();
    getRandom();
    updateCommand('watch');
    setTimeout(()=> {
        displayOrder();
    }, 1000);
}

// RESET PATTERNS
function resetPatterns() {
    comp = [];
    user = [];
}

// RESET CURRENT SCORE
function resetScore() {
    score = 0;
    scoreEl.innerHTML = score;
}

// SHOW START BTN
function showStartBtn() {
    startEl.style.display = 'inline-block';
}

// HIDE START BTN
function removeStartBtn() {
    startEl.style.display = 'none';
}

// MESSAGE - GAME OVER/HIGH SCORE
function message(text) {
    messageEl.innerText = text;
}

// CHECK IF BEAT HIGH SCORE
function checkScore() {
    if (score > highScore) {
        document.querySelector('.sound-win').play();
        message('High score!');
        highScore = score;
        localStorage.setItem('highScore', highScore);
    } else {
        document.querySelector('.sound-fail').play();
        message('Game over!');
    }
}

// GAME OVER
function gameOver() {
    userTurn = false;
    checkScore();
    gameOverEl.style.display = 'inline-block';
    removeCommand();
}

// HIDE GAME OVER EL
function hideGameOver() {
    gameOverEl.style.display = 'none';
}

// HARD RESET
function newGame() {
    userTurn = false;
    hideGameOver();
    showStartBtn();
    resetPatterns();
    resetScore();
}

// UPDATE HIGH SCORE
function updateHighScore() {
    highScoreEl.innerText = highScore;
}

// restart game
function restartGame() {
    userTurn = false;
    updateHighScore();
    hideGameOver();
    resetPatterns();
    resetScore();
    continueGame();
}

// SHOW CURRENT SCORE
function updateScoreBoard() {
    scoreEl.innerHTML = score;
}

window.addEventListener('click', function(e){
    if (e.target.classList.contains('btn--speed')) {
        for (i = 0; i < speedBtnsEl.length; i ++) {
            if (speedBtnsEl[i] === e.target) {
                speedBtnsEl[i].classList.add('active');
            } else {
                speedBtnsEl[i].classList.remove('active');
            }
        }
        
        // CHOSEN SPEED
        if(e.target === fastEl) {
            chosenSpeed = fast;
        } else if (e.target === normalEl) {
            chosenSpeed = normal;
        } else if (e.target === slowEl) {
            chosenSpeed = slow;
        }
    };

    
// USERS INPUT
    if (userTurn && e.target.classList.contains('btn')) {

        // SAVE INPUT
        user.push(e.target);
        const length = user.length;
        const currRound = length - 1;

        // PLAY CORRESPONDING SOUND
        const currentElement = parseInt(e.target.id) - 1;
        sounds[currentElement].play();
        
        // IF USER'S CORRECT
        if (user[currRound] === comp[currRound]) {
            // ADD SCORE
            score ++;
            updateScoreBoard();

            // IF COMPLETED SET
            if (user.length === comp.length) {
                userTurn = false;
                setTimeout(()=>{
                    continueGame();
                }, 200);
            }

        // IF USER'S INCORRECT
        } else {
            gameOver();
        }
    }
});

// CHECK LOCAL STORAGE
window.addEventListener("load",
    function(){
        if (!highScore) {
            localStorage.setItem('highScore', 0);
        }
        highScoreEl.innerText = highScore;
    }
);

// EVENT LISTENERS
speedBtnsEl.forEach(btn => btn.addEventListener('click', newGame));
startEl.addEventListener('click', continueGame);
soundEl.addEventListener('click', toggleSound);
gameOverEl.addEventListener('click', restartGame);

// FUTURE ADDITIONS
// => LEADER BOARD TABLE - NAME & SCORE - BACK END DATABASE
// => KEYBOARD ARROWS TO SELECT BTNS