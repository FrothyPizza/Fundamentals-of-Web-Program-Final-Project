


function pushOntoNextlist(nextList) {
    var bag = [0, 1, 2, 3, 4, 5, 6];
    
    // shuffle the bag
    for (var i = bag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = bag[i];
        bag[i] = bag[j];
        bag[j] = temp;
    }

    // Add the bag to the next list
    for (var i = 0; i < bag.length; i++) {
        nextList.push(bag[i]);
    }

}


class Clock {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.pausedTime = 0;
        this.isPaused = false;
        this.isStarted = false;
    }

    start() {
        this.startTime = Date.now();
        this.isStarted = true;
        this.isPaused = false;
    }

    pause() {
        if (this.isStarted && !this.isPaused) {
            this.isPaused = true;
            this.pausedTime = Date.now();
        }
    }

    resume() {
        if (this.isStarted && this.isPaused) {
            this.isPaused = false;
            this.startTime += (Date.now() - this.pausedTime);
        }
    }

    getElapsedTime() {
        if (this.isStarted && !this.isPaused) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        return this.elapsedTime;
    }

    restart() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.isStarted = true;
        this.isPaused = false;
    }
}

class PlayerTetrisGame {
    constructor() {
        this.gameState = new TetrisGameState();
        this.nextList = [];

        for(var i = 0; i < 14; i++) {
            pushOntoNextlist(this.nextList);
        }

        this.curMino = new Tetromino(this.nextList[0]);


        this.Lclock = new Clock();
        this.LclockRestarted = false;
        this.LARRClock = new Clock();

        this.Rclock = new Clock();
        this.RclockRestarted = false;
        this.RARRClock = new Clock();
        
        this.SDFClock = new Clock();


        this.Lclock.start();
        this.LARRClock.start();
        this.Rclock.start();
        this.RARRClock.start();
        this.SDFClock.start();

        this.das = 90;
        this.sdf = 5;
        this.arr = 0;



    }


    inputLeft(leftPressed, rightPressed) {
        if (rightPressed && this.RARRClock.getElapsedTime() > 0 && leftPressed) {
            this.Rclock.restart();
        }

        if (leftPressed && this.LclockRestarted == false) {
            this.Lclock.restart();
            this.LclockRestarted = true;
            this.gameState.moveX(this.curMino, -1);

        }
        else {
            if (leftPressed == false) this.LclockRestarted = false;
        }
        if (this.arr > 0) {
            if (this.Lclock.getElapsedTime() > this.das && leftPressed) {
                if (this.LARRClock.getElapsedTime() > this.arr) {
                    this.LARRClock.restart();
                    this.gameState.moveX(this.curMino, -1);
                }
            }
        }
        else {
            if (this.Lclock.getElapsedTime() > this.das && leftPressed) {
                this.gameState.arrX(this.curMino, -1);
            }
        }
    }


    inputRight(leftPressed, rightPressed) {
        if (leftPressed && this.LARRClock.getElapsedTime() > 0 && rightPressed) {
            this.Lclock.restart();
        }

        if (rightPressed && this.RclockRestarted == false) {
            this.Rclock.restart();
            this.RclockRestarted = true;
            this.gameState.moveX(this.curMino, 1);

        }
        else {
            if (rightPressed == false) this.RclockRestarted = false;
        }
        if (this.arr > 0) {
            if (this.Rclock.getElapsedTime() > this.das && rightPressed) {
                if (this.RARRClock.getElapsedTime() > this.arr) {
                    this.RARRClock.restart();
                    this.gameState.moveX(this.curMino, 1);
                }
            }
        }
        else {
            if (this.Rclock.getElapsedTime() > this.das && rightPressed) {
                this.gameState.arrX(this.curMino, 1);
            }
        }
    }


    inputDown() {
        if(this.sdf == 0) {
            this.gameState.sonicDrop(this.curMino);
        }
        else {
            if(this.SDFClock.getElapsedTime() > this.sdf) {
                this.SDFClock.restart();
                this.gameState.softDrop(this.curMino);
            }
        }
    }


   
    // this is used for instantaneous inputs
    inputGeneral(keyCode) {
        // hard drop
        if (keyCode == CONTROLS.HARD_DROP) {
            let mino = this.curMino.mino;
            let oldMino = new Tetromino(this.curMino);
            let oldState = new TetrisGameState(this.gameState);
            this.gameState.hardDrop(this.curMino);
            this.curMino.setTetromino(this.nextList[0]);
            this.nextList.splice(0, 1);
            if (this.nextList.length < 14) this.pushOntoNextlist();
            //piecesPlaced++;

            let clear = this.gameState.lastClear;
            if (clear <= 0) this.gameState.placeGarbage();

            let attack = this.gameState.lastAttack;



            return attack;
        }

        
        if (keyCode == CONTROLS.HOLD) {
            this.gameState.performHold(this.curMino, this.nextList);
        }
        if (keyCode == CONTROLS.ROTATE_CW) {
            this.gameState.rotate(this.curMino, 1);
        }
        if (keyCode == CONTROLS.ROTATE_CCW) {
            this.gameState.rotate(this.curMino, -1);
        }
        if (keyCode == CONTROLS.ROTATE_180) {
            this.gameState.rotate(this.curMino, 2);
        }
        if (keyCode == CONTROLS.RESTART) {
            this.gameState.resetMatrix();
        }

        return 0;
    }


    render(context, position, tileSize) {
        renderTetris(context, position, tileSize, this.gameState, this.curMino, this.nextList);
    }
}

