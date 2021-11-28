
let keys = [];

document.addEventListener('keydown', event => {
    keys[event.keyCode] = true;
});

document.addEventListener('keyup', event => {
    keys[event.keyCode] = false;
});

const RIGHT = 39;
const LEFT = 37;
const UP = 38;
const DOWN = 40;
const ESC = 27;

let canvas = document.getElementById('canvas');

let fullScreen = true;
let context = canvas.getContext('2d');


let playerTetrisGame = new PlayerTetrisGame();






restartButton.onclick = function() {
    if(confirm("Would you really like to restart? This will erase your progress.")) {
        completlyRestart();
        pause();
    }
}

resumeButton.onclick = function() {
    pause();
}

settingsButton.onclick = function() {
    if(settingsContents.style.display == 'none') {
        settingsContents.style.display = "block";
    } else {
        settingsContents.style.display = "none";
    }

    backButton.style.display = "block";
    mainPauseMenu.style.display = 'none';

}



homeButton.onclick = function() {
    window.location = "../index.html";
}


let paused = false;
function pause() {
    if(!paused) {
        backButton.style.display = "none";
        mainPauseMenu.style.display = 'block';
        settingsContents.style.display = 'none';

        document.getElementById('pauseMenu').style.visibility = 'visible';
        paused = true;

    } else {
        document.getElementById('pauseMenu').style.visibility = 'hidden';

        paused = false;
    }
}


dasInput.value = playerTetrisGame.das;
arrInput.value = playerTetrisGame.arr;
sdfInput.value = playerTetrisGame.sdf;

dasInput.onchange = function() {
    playerTetrisGame.das = dasInput.value;
    localStorage.setItem('das', dasInput.value);
}
arrInput.onchange = function() {
    playerTetrisGame.arr = arrInput.value;
    localStorage.setItem('arr', arrInput.value);
}
sdfInput.onchange = function() {
    playerTetrisGame.sdf = sdfInput.value;
    localStorage.setItem('sdf', sdfInput.value);
}

function getKeyNameFromCode(code) {
    switch(code) {
        case 37:
            return 'Left';
        case 38:
            return 'Up';
        case 39:
            return 'Right';
        case 40:
            return 'Down';
        case 27:
            return 'Escape';
        case 32:
            return 'Space';
        case 16:
            return 'Shift';
        case 17:
            return 'Ctrl';
        case 18:
            return 'Alt';
        default:
            return String.fromCharCode(code);
    }
}

function setControl(id, code) {
    switch(id) {
        case 'leftInput':
            CONTROLS.LEFT = code;
            break;
        case 'rightInput':
            CONTROLS.RIGHT = code;
            break;
        case 'rotateCWInput':
            CONTROLS.ROTATE_CW = code;
            break;
        case 'rotateCCWInput':
            CONTROLS.ROTATE_CCW = code;
            break;
        case 'rotate180Input':
            CONTROLS.ROTATE_180 = code;
            break;
        case 'softDropInput':
            CONTROLS.SOFT_DROP = code;
            break;
        case 'hardDropInput':
            CONTROLS.HARD_DROP = code;
            break;
        case 'holdInput':
            CONTROLS.HOLD = code;
            break;
        case 'restartInput':
            CONTROLS.RESTART = code;
            break;  
    }
}

if(localStorage.getItem('das') != null) {
    dasInput.value = localStorage.getItem('das');
    playerTetrisGame.das = dasInput.value;
}
if(localStorage.getItem('arr') != null) {
    arrInput.value = localStorage.getItem('arr');
    playerTetrisGame.arr = arrInput.value;
}
if(localStorage.getItem('sdf') != null) {
    sdfInput.value = localStorage.getItem('sdf');
    playerTetrisGame.sdf = sdfInput.value;
}

if(localStorage.getItem('controls') != null) {
    CONTROLS = JSON.parse(localStorage.getItem('controls'));
}

leftInput.value = getKeyNameFromCode(CONTROLS.LEFT);
rightInput.value = getKeyNameFromCode(CONTROLS.RIGHT);
rotateCWInput.value = getKeyNameFromCode(CONTROLS.ROTATE_CW);
rotateCCWInput.value = getKeyNameFromCode(CONTROLS.ROTATE_CCW);
rotate180Input.value = getKeyNameFromCode(CONTROLS.ROTATE_180);
softDropInput.value = getKeyNameFromCode(CONTROLS.SOFT_DROP);
hardDropInput.value = getKeyNameFromCode(CONTROLS.HARD_DROP);
holdInput.value = getKeyNameFromCode(CONTROLS.HOLD);
restartInput.value = getKeyNameFromCode(CONTROLS.RESTART);



currentlySelectedInput = null;
let controlInputs = document.getElementsByClassName('controlInput');

for(let i = 0; i < controlInputs.length; i++) {
    controlInputs[i].onclick = function() {
        currentlySelectedInput = controlInputs[i];

        if(currentlySelectedInput.classList.contains('selectedInput')) {
            currentlySelectedInput.classList.remove('selectedInput');
        } else {
            controlInputs[i].classList.add('selectedInput');
        }

        for(let j = 0; j < controlInputs.length; j++) {
            if(j != i) {
                controlInputs[j].classList.remove('selectedInput');
            }
        }
    }
}


document.addEventListener('keydown', e => {
    if(e.keyCode == ESC) {
        pause();
        if(currentlySelectedInput != null)
            currentlySelectedInput.classList.remove('selectedInput');
        currentlySelectedInput = null;
        return;
    }
    if(currentlySelectedInput != null) {
        currentlySelectedInput.value = getKeyNameFromCode(e.keyCode);
        
        setControl(currentlySelectedInput.id, e.keyCode);

        currentlySelectedInput.classList.remove('selectedInput');
        currentlySelectedInput = null;

        localStorage.setItem('controls', JSON.stringify(CONTROLS));


    }
});

backButton.onclick = function() {
    settingsContents.style.display = "none";
    backButton.style.display = "none";
    mainPauseMenu.style.display = 'block';

    if(currentlySelectedInput != null)
        currentlySelectedInput.classList.remove('selectedInput');
    currentlySelectedInput = null;

}



document.addEventListener('keydown', e => {
    if(!paused) 
        playerTetrisGame.inputGeneral(e.keyCode);
});







window.setInterval(() => {

    if(fullScreen) {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    }




    context.fillStyle = '#000';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    if(!paused) {
        if(keys[CONTROLS.SOFT_DROP]) playerTetrisGame.inputDown();
        playerTetrisGame.inputLeft(keys[CONTROLS.LEFT], keys[CONTROLS.RIGHT]);
        playerTetrisGame.inputRight(keys[CONTROLS.LEFT], keys[CONTROLS.RIGHT]);

        
        
    }

    // Draw the game centered on screen
    blockSize = Math.round(canvas.height / (HEIGHT-YMARGIN + 4));
    let xOffset = (canvas.width - WIDTH * blockSize) / 2;
    let yOffset = (canvas.height - (HEIGHT - YMARGIN) * blockSize) / 2;
    playerTetrisGame.render(context, {x: xOffset, y: yOffset}, blockSize, blockSize);


    //Make it so that if the pause menu is too tall, it's moved down so that the top of the pause menu is at the top of the screen
    //and that there is a scroll bar
    if(pauseContents.clientHeight > document.documentElement.clientHeight) {
        pauseContents.style.top = document.documentElement.clientHeight/1.8 + 'px';



    } else {
        pauseContents.style.top = '50%';
    }


}, 1000/60);