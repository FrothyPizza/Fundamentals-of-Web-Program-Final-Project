
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

let canvas = document.getElementById('canvas');

let fullScreen = true;
let context = canvas.getContext('2d');


let playerTetrisGame = new PlayerTetrisGame();

document.addEventListener('keydown', e => {
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

    playerTetrisGame.inputRight(keys[LEFT], keys[RIGHT]);
    if(keys[DOWN]) playerTetrisGame.inputDown();
    playerTetrisGame.inputLeft(keys[LEFT], keys[RIGHT]);

    playerTetrisGame.render(context, {x: 200, y: 100}, 30);

}, 1000/60);