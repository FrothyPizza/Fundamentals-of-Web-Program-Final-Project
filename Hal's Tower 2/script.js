

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

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}


let canvas = document.getElementById('canvas');

canvas.width = 600;
canvas.height = 600;
let fullScreen = true;
let context = canvas.getContext('2d');

let view = {
    x: 0,
    y: 0
};

function fill(r, g, b){
    context.fillStyle = 'rgb('+r+', '+g+', '+b+')';    
}

function rect(x, y, w, h){
    //context.fillRect(Math.round(x - view.x), Math.round(y - view.y), w, h);   
    context.fillRect(x - view.x, y - view.y, w, h);   
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

const BLOCK_SIZE = 40;
const COLLISION_MARGIN = 7;



let BLOCKS = {
    ground: 'B',
    invisibleGround: 'I',
    red: 'R',
    darkRed: 'Q', // completely restarts the game
    bounce: 'J',
    checkpoint: 'C',
    spawn: 'S',
    flashing: 'F',
    flashingOff: 'f',
    disappearing: 'D',
    hasDisappeared: 'd',
    notThere: 'N', // a false block
    win: 'W'
}
//let FRAMES_PER_FLASH = 60;
let SECONDS_PER_FLASH = 1;
let flashingBlockTimer = new Clock();
flashingBlockTimer.start();

// map converter is here 
// https://replit.com/@HaroldSeamans/Hals-Tower-Map-Format-Converter#Main.java
let map =  [
            "BBBB.................",
            "B..B.................",
            "B..B.................",
            "BBBB.................",
            ".....................","","","","","","","","","","","","", // add more blank separation
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            "..................B.R",
            "BRRRRRRRRRRCRRRRRR..R",
            "B.........R.R....R..R",
            "B........R..R....R..R",
            "B........R..R....RJ.R",
            "B........R.R.....R..R",
            "B........R.R.....R..R",
            "B........R.R.....R..R",
            "B.......R..R.....RJ.R",
            "B.......R..R.....R..R",
            "B.......R..R.....R..R",
            "B......R..R......R..R",
            "B......R..R......RJ.R",
            "B......RR.R......R..R",
            "B......R..R......R...",
            "B......R..R......R...",
            "B......R..R......RJRB.D",
            "B......R..R.........B",
            "B......R..R.........B.D",
            "B......R..R.........B",
            "B......R.RR.........B.D",
            "B......R..R.........B",
            "B......R..R.........B.D",
            "B...................B",
            "B...................B..D",
            "B...................B",
            "B...................B..D",
            "B...................B",
            "B.......R...........B..D",
            "B.R.................B",
            "BR.R................B..D",
            "BR..R...............B",
            "R....R.....R........B..D",
            "R....R..............B",
            "RD.R.R...R..........B...D",
            "R..R.R..............B",
            "RD.R.R......R.......B...D",
            "R..R.R..............B",
            "RD.R.R....R.R.......B...D",
            "R..R.R.....W........B",
            "RD.R.R...RRRRR......B...D",
            "R..R.R..............B",
            "RD.R.R..............B...D",
            "R..R.R...............",
            "RD.R....................D",
            "R..R.D....D....D....B",
            "RD.RR...............B",
            "R.........C.........BCCCCCCCCCCCC..R",
            "BDDBBBBBBBBB.BBBBBBBBBBBBBBBBBBBBBBB",
            "BCCB................B",
            "BRRB........B.......B",
            "B...................B",
            "B.........RRBN......B",
            "B.....RRRR..R........",
            "B.R.....R....R......B..................BR",
            "BR......RR.R.R......B...........B",
            "B.D.R...R..R.R...J..B.....C",
            "BR..R....D.R.R......BBBBBBB",
            "B.D.R......R.B......B",
            "BR..R...RD.R........B",
            "B.D.R...RRRR.....J..B",
            "BR..R...R...RBR.....B",
            "B.D.R...R...........B",
            "BR..RRJRR...........B",
            "B.D.RRR..R..........B",
            "B.....C..R..........B",
            "BBBBBBBB.RBBBBBBBBBBB",
            "B...................B",
            "B...................B",
            "B...................B",
            "B......RJ...........B",
            "B.....R.............B",
            "B.....R.............B",
            "B.....R.J...........B",
            "B.....R..R..........B",
            "B.....R..R..........B",
            "B.......JB..........B",
            "B.........R.........B",
            "B.........R.........B",
            "B.......J.R.........B",
            "B......R..R.........B",
            "B......R..R.........B",
            "B......BJ...........B",
            "B.....R.............B",
            "B.....R.............B",
            "B.....R.JR..........B",
            "B.....R..R..........B",
            "B.....R..R..........B",
            "B.....R.J...........B",
            "B.....R...R.R.R.R...B",
            "B.....R.....R.R.R...B",
            "B.....R.J.B.R.R.R...B",
            "B......R..R.........B",
            "B.........R.......R.B",
            "B.........R.........B",
            "B..........JJJJJJ.B.R",
            "B.............R.R.R.B",
            "B......R............B",
            "B..RR...............B",
            "B.....R.R.R.R.R.R.J.B",
            "B.R...R.R.R.R.R.R.JCB",
            "B...RB.F.F.f.BBFBB.BB",
            "B..B..........B.B...B",
            "BR............B.B...B",
            "B.B...........B.B...B",
            "B.............BCB...B",
            "BBBBBBBBBBC.BBBRBBBBB",
            "B.........B.R.......B",
            "B.R.........R.......B",
            "B.J.......B.R.......B",
            "BRR.R......R........B",
            "R...R...............B",
            "R...R...............B",
            "...J...R...F........B",
            "B......R............B",
            "B.....R.....F.......B",
            "R......B............B",
            "R.....R........R....B",
            "R..J...B.......J....B",
            "R.............CB....B",
            "BRRRRRRRRRRRR.BBBBBBB",
            "B...................B",
            "B.............F.....B",
            "B..............F....B",
            "B...................B",
            "B................RFRB",
            "B................R.RB",
            "B................RfRB",
            "B................R.RB",
            "B................RFRB",
            "B................R.RB",
            "B...RR...........RfRB",
            "B..................RB",
            "B.....RBR....RBR..FRB",
            "B..................RB",
            "B.R...............BRB",
            "B.R.................B",
            "B.RJ................B",
            "B.....RBR....RBR..R.R",
            "B.................RFB",
            "B...................R",
            "B..................BB",
            "B...................B",
            "B.........F......F..B",
            "B....F..............B",
            "B..C................B",
            "BBBB...RRRRRRRRRRRRRB",
            "B...B...............B",
            "B....B..............B",
            "B...R...............B",
            "B....B..............B",
            "B...R.....RR........B",
            "B....B....BR........B",
            "B..........R........B",
            "B...................B",
            "B........R..........B",
            "B.........J.........B",
            "B...................B",
            "B..................RB",
            "B.................J.B",
            "B...................B",
            "B........R..........B",
            "B.........J.........B",
            "B...................B",
            "B..................RB",
            "B.................J.B",
            "B...................B",
            "B...................B",
            "B.R.......JRRRRRRRRRB",
            "B.J......B..........B",
            "B...RRRRR...........B",
            "B...................B",
            "B...................B",
            "R..J................B",
            "BB.....BR...RB..R..RB",
            "B...............RB.RB",
            "B..B............R..RB",
            "B................B..B",
            "B..................BB",
            "B.......R..........RB",
            "B.................B.B",
            "B.......B.RB........B",
            "BB..................B",
            "BC..................B",
            "BBBB.RRRRRRRRRRRRRRRB",
            "B...................B",
            "B...................B",
            "B....J..............B",
            "B...................B",
            "B...................B",
            "B...................B",
            "B....J..............B",
            "B...................B",
            "B...................B",
            "B...................B",
            "B...RJ..............B",
            "B...................B",
            "B...................B",
            "B...................B",
            "B...RJR.............B",
            "B..........RJR......B",
            "B...................B",
            "B..................JB",
            "B............R......B",
            "B...R..R...........BB",
            "B............B......B",
            "B...B..B............B",
            "BF..................B",
            "R...................B",
            "BB..................B",
            "B....F.....F........B",
            "B...................B",
            "B...................B",
            "B...............R...B",
            "B..............J....B",
            "B.....J.............B",
            "B.C.................B",
            "BBB.RRRRRRRRRRRRRRRRB",
            "B...................B",
            "B..B................B",
            "B...................B",
            "B...fFfFfFfFfFfFfF..B",
            "B..................FB",
            "B...................B",
            "B.................F.B",
            "B............F......B",
            "B......F............B",
            "B...................B",
            "B.B.................B",
            "B......F............B",
            "B............F......B",
            "B...................R",
            "B..................BB",
            "B...................B",
            "B..............F....B",
            "B..........F........B",
            "B.....F.............B",
            "BC..................B",
            "BBB.BRRRRRRRRRRRRRRRB",
            "B...R...............B",
            "B..B................B",
            "B..R................B",
            "B.B.................B",
            "B...................B",
            "BB.................RB",
            "B....R....R....R....B",
            "B...B....B....B....BB",
            "B...................B",
            "B..................BB",
            "B.............BB....B",
            "B......BB...........B",
            "BB..................B",
            "R...................B",
            "BB..................B",
            "B....B..............B",
            "B.........S.........B",
            "BRRRRRRRRBBBRRRRRRRRB",];



const playerConstants = {
    grav: 0.1,
    jumpHeight: -4.6,
    width: BLOCK_SIZE/2,
    height: BLOCK_SIZE/2,
    bounceHeight: -6.2,
    horizontalBounce: 12
};

let player = {
    x: 0,
    y: 0,
    xVel: 0,
    yVel: 0,
    spawnX: 0,
    spawnY: 0,
    deaths: 0,
    hasWon: false,
    savedTime: 0
};


function resetPlayer() {
    
    player.x = player.spawnX;
    player.y = player.spawnY;
    
    player.xVel = 0;
    player.yVel = 0;
    
    player.deaths += 1;
    
    for(let y = 0; y < map.length; ++y){
        for(let x = 0; x < map[y].length; ++x){
            if(map[y][x] == BLOCKS.hasDisappeared)
                map[y] = map[y].replaceAt(x, BLOCKS.disappearing);
        }
    }
    
}
function completlyRestart() {
    resetPlayer();
    
    player.xVel = 0;
    player.yVel = 0;
    player.deaths = 0;
    
    for(let y = 0; y < map.length; ++y){
        for(let x = 0; x < map[y].length; ++x){
            if(map[y][x] == BLOCKS.spawn) {
                let blockX = x * BLOCK_SIZE;
                let blockY = y * BLOCK_SIZE;    
                player.spawnX = blockX + BLOCK_SIZE/2 - playerConstants.width/2;
                player.spawnY = blockY + BLOCK_SIZE - playerConstants.height;
                
                //exit when it's found
                y=map.length;
                break;
            }
        }   
    }
    player.x = player.spawnX;
    player.y = player.spawnY;
    
    player.hasWon = false;
} 







// collisionProtrusion is how far out of the block the hitbox protrudes
// boxWidth is how much shorter the hitbox should be
function collidingWithLeftOfBlock(blockX, blockY, collisionProtrusion=0, boxWidth=0) {
    return player.x + playerConstants.width > blockX - collisionProtrusion && player.x + playerConstants.width < blockX + COLLISION_MARGIN &&
           player.y + playerConstants.height > blockY + boxWidth && player.y < blockY + BLOCK_SIZE - boxWidth;
}
function collidingWithRightOfBlock(blockX, blockY, collisionProtrusion=0, boxWidth=0) {
    return player.x > blockX + BLOCK_SIZE - COLLISION_MARGIN && player.x < blockX + BLOCK_SIZE + collisionProtrusion &&
           player.y + playerConstants.height > blockY + boxWidth && player.y < blockY + BLOCK_SIZE - boxWidth;
}
function collidingWithTopOfBlock(blockX, blockY, collisionProtrusion=0, boxWidth=0) {
    return player.x + playerConstants.width > blockX + boxWidth && player.x < blockX + BLOCK_SIZE - boxWidth &&
           player.y + playerConstants.height > blockY - collisionProtrusion && player.y + playerConstants.height < blockY + COLLISION_MARGIN
}
function collidingWithBottomOfBlock(blockX, blockY, collisionProtrusion=0, boxWidth=0) {
    return player.x + playerConstants.width > blockX + boxWidth && player.x < blockX + BLOCK_SIZE - boxWidth &&
           player.y > blockY + BLOCK_SIZE - COLLISION_MARGIN && player.y < blockY + BLOCK_SIZE + collisionProtrusion
}

function collidingWithBlock(blockX, blockY, collisionProtrusion=0) {
    return collidingWithLeftOfBlock(blockX, blockY, collisionProtrusion) ||
           collidingWithRightOfBlock(blockX, blockY, collisionProtrusion) ||
           collidingWithTopOfBlock(blockX, blockY, collisionProtrusion) ||
           collidingWithBottomOfBlock(blockX, blockY, collisionProtrusion);
}



           
// function renderMapAndHandleCollisions(){
//     ++flashingBlockTimer;
//     for(let y = 0; y < map.length; ++y) {
//         for(let x = 0; x < map[y].length; ++x) {
            
//             if(flashingBlockTimer % FRAMES_PER_FLASH == 0) {
                
//                 if(map[y][x] == BLOCKS.flashing)
//                     map[y] = map[y].replaceAt(x, BLOCKS.flashingOff);
//                 else if(map[y][x] == BLOCKS.flashingOff)
//                     map[y] = map[y].replaceAt(x, BLOCKS.flashing);
//                 flashingBlockTimer = 0;
//             }
            

//             let blockX = x * BLOCK_SIZE;
//             let blockY = y * BLOCK_SIZE;         
            
//             if(blockX - view.x > canvas.width) continue;
//             if(blockX - view.x < 0 - BLOCK_SIZE) continue;
//             if(blockY - view.y > canvas.height) continue;
//             if(blockY - view.y < 0 - BLOCK_SIZE) continue;
            
//             fill(100, 100, 100);
//             switch(map[y][x]){
//                 case BLOCKS.ground:
//                     fill(100, 100, 100);
//                     break;
//                 case BLOCKS.disappearing:
//                     fill(80, 80, 80);
//                     break;
//                 case BLOCKS.win:
//                     fill(57, 255, 20);
//                     break;
//                 case BLOCKS.notThere:
//                     fill(120, 120, 120);
//                     break;
//                 case BLOCKS.flashing:
//                     fill(120, 120, 120);
//                     break;
//                 case BLOCKS.flashingOff:
//                     fill(175, 167, 205);
//                     break;
//                 case BLOCKS.red:
//                     fill(255, 0, 0);
//                     break;
//                 case BLOCKS.checkpoint:
//                     fill(255, 255, 0);
//                     break;
//                 case BLOCKS.bounce:
//                     fill(255, 0, 255);
//                     break;
//                 default:
//                     break;
//             }

//             if(map[y][x] == BLOCKS.ground || 
//                map[y][x] == BLOCKS.red || 
//                map[y][x] == BLOCKS.checkpoint || 
//                map[y][x] == BLOCKS.bounce ||
//                map[y][x] == BLOCKS.flashing ||
//                map[y][x] == BLOCKS.flashingOff ||
//                map[y][x] == BLOCKS.disappearing ||
//                map[y][x] == BLOCKS.notThere ||
//                map[y][x] == BLOCKS.win) {
                
//                 rect(blockX, blockY, BLOCK_SIZE+1, BLOCK_SIZE+1);   
//             }
            
//             if(map[y][x] == BLOCKS.win) {
//                 if(collidingWithBlock(blockX, blockY)) {
//                     player.hasWon = true;   
//                     player.x = BLOCK_SIZE * 1.5;
//                     player.y = BLOCK_SIZE * 1.5;
//                 }
//             }

            
//             // Handle collisions here /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//             if(map[y][x] == BLOCKS.checkpoint) {
//                 if(collidingWithBlock(blockX, blockY)) {
//                     player.spawnX = blockX + BLOCK_SIZE/2 - playerConstants.width/2;
//                     player.spawnY = blockY + BLOCK_SIZE - playerConstants.height;
                    
//                     localStorage.setItem('spawnX', player.spawnX.toString());
//                     localStorage.setItem('spawnY', player.spawnY.toString());
//                     localStorage.setItem('deaths', player.deaths.toString());
//                     localStorage.setItem('time', player.savedTime.toString());
//                 }
//             }
            
//             if(map[y][x] == BLOCKS.red) {
//                 if(collidingWithTopOfBlock(blockX, blockY, 1) || 
//                    collidingWithBottomOfBlock(blockX, blockY, 1) || 
//                    collidingWithRightOfBlock(blockX, blockY, 1, 1) || 
//                    collidingWithLeftOfBlock(blockX, blockY, 1, 1)) {
//                     resetPlayer(); 
//                     localStorage.setItem('deaths', player.deaths.toString());
//                     localStorage.setItem('time', player.savedTime.toString());
//                 }
//             }

//             if(map[y][x] == BLOCKS.bounce) {
//                 if(collidingWithTopOfBlock(blockX, blockY, 0, 0)) {
//                     player.yVel = playerConstants.bounceHeight;
//                     player.y = blockY-playerConstants.height;
//                 }
//                 if(collidingWithBottomOfBlock(blockX, blockY, -1, 2)){
//                     player.y = blockY+BLOCK_SIZE;
//                     player.yVel = -playerConstants.bounceHeight;
//                 }
//                 if(collidingWithLeftOfBlock(blockX, blockY, 0, 2)) {
//                     player.xVel = -playerConstants.horizontalBounce;
//                     player.x = blockX-playerConstants.width;
//                 }
//                 if(collidingWithRightOfBlock(blockX, blockY, 0, 2)) {
//                     player.xVel = playerConstants.horizontalBounce;
//                     player.x = blockX+BLOCK_SIZE;
//                 }


//             }
            
//             // This is the main block collision checks /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//             // If you want there to be a block that acts the same as a normal block with some changed functionality,
//             // i.e. a block that only bounces you to the left if you're colliding with the left,
//             // then you can use any of these cases with the new block
//             // make sure you copy all of this code
//             if(map[y][x] == BLOCKS.ground || map[y][x] == BLOCKS.invisibleGround || map[y][x] == BLOCKS.flashing || map[y][x] == BLOCKS.disappearing) {
//                 if(collidingWithTopOfBlock(blockX, blockY, 0, 2)) {
//                     // if moving up, then don't allow for a jump
//                     let shouldntJump = false;
//                     if(player.yVel < 0) shouldntJump = true;
                    
//                     player.yVel = 0;
//                     player.y = blockY-playerConstants.height;
//                     //player.grav = 0;
//                     if(keys[UP] && !shouldntJump) {
//                         player.yVel = playerConstants.jumpHeight;
//                         if(map[y][x] == BLOCKS.disappearing) {
//                             map[y] = map[y].replaceAt(x, BLOCKS.hasDisappeared);    
//                         }
                        
//                     }
                    


//                 }
//                 if(collidingWithBottomOfBlock(blockX, blockY, 0, 2)){
//                     player.y = blockY+BLOCK_SIZE;
//                     player.yVel = 0;
//                 }
//                 if(collidingWithLeftOfBlock(blockX, blockY, 0, 2)) {
//                     player.xVel = 0;
//                     player.x = blockX-playerConstants.width;
//                 }
//                 if(collidingWithRightOfBlock(blockX, blockY, 0, 2)) {
//                     player.xVel = 0;
//                     player.x = blockX+BLOCK_SIZE;
//                 }


//             }
            
            
//         }
//     }
// }
function renderMap() {
    for(let y = 0; y < map.length; ++y) {
        for(let x = 0; x < map[y].length; ++x) {
            
        
            let blockX = x * BLOCK_SIZE;
            let blockY = y * BLOCK_SIZE;         
            
            if(blockX - view.x > canvas.width) continue;
            if(blockX - view.x < 0 - BLOCK_SIZE) continue;
            if(blockY - view.y > canvas.height) continue;
            if(blockY - view.y < 0 - BLOCK_SIZE) continue;
            
            fill(100, 100, 100);
            switch(map[y][x]){
                case BLOCKS.ground:
                    fill(100, 100, 100);
                    break;
                case BLOCKS.disappearing:
                    fill(80, 80, 80);
                    break;
                case BLOCKS.win:
                    fill(57, 255, 20);
                    break;
                case BLOCKS.notThere:
                    fill(120, 120, 120);
                    break;
                case BLOCKS.flashing:
                    fill(120, 120, 120);
                    break;
                case BLOCKS.flashingOff:
                    fill(175, 167, 205);
                    break;
                case BLOCKS.red:
                    fill(255, 0, 0);
                    break;
                case BLOCKS.checkpoint:
                    fill(255, 255, 0);
                    break;
                case BLOCKS.bounce:
                    fill(255, 0, 255);
                    break;
                default:
                    break;
            }

            if(map[y][x] == BLOCKS.ground || 
               map[y][x] == BLOCKS.red || 
               map[y][x] == BLOCKS.checkpoint || 
               map[y][x] == BLOCKS.bounce ||
               map[y][x] == BLOCKS.flashing ||
               map[y][x] == BLOCKS.flashingOff ||
               map[y][x] == BLOCKS.disappearing ||
               map[y][x] == BLOCKS.notThere ||
               map[y][x] == BLOCKS.win) {
                
                rect(blockX, blockY, BLOCK_SIZE+1, BLOCK_SIZE+1);   
            }
        }
    }


}

           
function handleCollisions() {
    for(let y = 0; y < map.length; ++y) {
        for(let x = 0; x < map[y].length; ++x) {
            if(flashingBlockTimer.getElapsedTime()/1000 > SECONDS_PER_FLASH) {                
                if(map[y][x] == BLOCKS.flashing)
                    map[y] = map[y].replaceAt(x, BLOCKS.flashingOff);
                else if(map[y][x] == BLOCKS.flashingOff)
                    map[y] = map[y].replaceAt(x, BLOCKS.flashing);
            }
        }
    }
    if(flashingBlockTimer.getElapsedTime()/1000 > SECONDS_PER_FLASH) {  
        flashingBlockTimer.restart();
    }

    for(let y = 0; y < map.length; ++y) {
        for(let x = 0; x < map[y].length; ++x) {
            let blockX = x * BLOCK_SIZE;
            let blockY = y * BLOCK_SIZE;
            
            if(map[y][x] == BLOCKS.win) {
                if(collidingWithBlock(blockX, blockY)) {
                    player.hasWon = true;   
                    player.x = BLOCK_SIZE * 1.5;
                    player.y = BLOCK_SIZE * 1.5;
                }
            }

            if(map[y][x] == BLOCKS.checkpoint) {
                if(collidingWithBlock(blockX, blockY)) {
                    player.spawnX = blockX + BLOCK_SIZE/2 - playerConstants.width/2;
                    player.spawnY = blockY + BLOCK_SIZE - playerConstants.height;

                    localStorage.setItem('spawnX', player.spawnX.toString());
                    localStorage.setItem('spawnY', player.spawnY.toString());
                    localStorage.setItem('deaths', player.deaths.toString());
                    localStorage.setItem('time', player.savedTime.toString());
                }
            }
            
            if(map[y][x] == BLOCKS.red) {
                if(collidingWithTopOfBlock(blockX, blockY, 1) || 
                   collidingWithBottomOfBlock(blockX, blockY, 1) || 
                   collidingWithRightOfBlock(blockX, blockY, 1, 1) || 
                   collidingWithLeftOfBlock(blockX, blockY, 1, 1)) {
                    resetPlayer(player); 
                    localStorage.setItem('deaths', player.deaths.toString());
                    localStorage.setItem('time', player.savedTime.toString());
                }
            }

            if(map[y][x] == BLOCKS.bounce) {
                if(collidingWithTopOfBlock(blockX, blockY, 0, 0)) {
                    player.yVel = playerConstants.bounceHeight;
                    player.y = blockY-playerConstants.height;
                }
                if(collidingWithBottomOfBlock(blockX, blockY, -1, 2)){
                    player.y = blockY+BLOCK_SIZE;
                    player.yVel = -playerConstants.bounceHeight;
                }
                if(collidingWithLeftOfBlock(blockX, blockY, 0, 2)) {
                    player.xVel = -playerConstants.horizontalBounce;
                    player.x = blockX-playerConstants.width;
                }
                if(collidingWithRightOfBlock(blockX, blockY, 0, 2)) {
                    player.xVel = playerConstants.horizontalBounce;
                    player.x = blockX+BLOCK_SIZE;
                }


            }

            if(map[y][x] == BLOCKS.ground || map[y][x] == BLOCKS.invisibleGround || map[y][x] == BLOCKS.flashing || map[y][x] == BLOCKS.disappearing) {
                if(collidingWithTopOfBlock(blockX, blockY, 0, 2)) {
                    
                    player.yVel = 0;
                    player.y = blockY-playerConstants.height;
                    if(keys[UP]) {
                        player.yVel = playerConstants.jumpHeight;
                        if(map[y][x] == BLOCKS.disappearing) {
                            map[y] = map[y].replaceAt(x, BLOCKS.hasDisappeared);    
                        }
                        
                    }
                    


                }
                if(collidingWithBottomOfBlock(blockX, blockY, 0, 2)){
                    player.y = blockY+BLOCK_SIZE;
                    player.yVel = 0;
                }
                if(collidingWithLeftOfBlock(blockX, blockY, 0, 2)) {
                    player.xVel = 0;
                    player.x = blockX-playerConstants.width;
                }
                if(collidingWithRightOfBlock(blockX, blockY, 0, 2)) {
                    player.xVel = 0;
                    player.x = blockX+BLOCK_SIZE;
                }


            }
            
            
        }
    }
}


function updatePlayerPhysics(delta) {
    player.yVel += playerConstants.grav * delta/16.66;
    
    if(player.yVel > COLLISION_MARGIN) player.yVel = COLLISION_MARGIN;
    //if(player.yVel < -COLLISION_MARGIN) player.yVel = -COLLISION_MARGIN;
    //if(player.xVel > COLLISION_MARGIN) player.xVel = COLLISION_MARGIN;
    //if(player.xVel < -COLLISION_MARGIN) player.xVel = -COLLISION_MARGIN;

    player.y += player.yVel * delta/16.66;
    player.x += player.xVel * delta/16.66;


    

    let friction = 0.0067;
    let modifiedFriction = 1 / (1 + (delta * friction));

    player.xVel *= modifiedFriction;
}


function renderPlayer() {
    fill(100, 100, 100);
    rect(player.x, player.y, playerConstants.width, playerConstants.height);   

}

function lerp(a, b, t) {
    return a + (b-a) * t;
}
function constrain(a, b, c) {
    if(a < b) return b;
    if(a > c) return c;
    return a;
}

// Make the view smoothly follow the player using a linear interpolation
function updateView(){

    width = canvas.width;
    height = canvas.height;

    viewSmoothness = 0.005 * delta;

    view.x = lerp(view.x, player.x - width/2, viewSmoothness);
    view.y = lerp(view.y, player.y - height/2, viewSmoothness);
    
    view.y = constrain(view.y, 0, map.length * BLOCK_SIZE - height);
    // view.x = player.x - canvas.width/2 - playerConstants.width/2;
    // view.y = player.y - canvas.height/2 - playerConstants.height/2;
}

let savedTime = 0;
let startDate = new Date();
let startTime = startDate.getTime();
let pauseTime = 0;
function secondsElapsed() {
    let date = new Date();
    let time = date.getTime();
    let difference = time - startTime;
    let seconds = difference / 1000;
	
    player.savedTime = seconds + savedTime;

    if(paused) return pauseTime;
    return seconds + savedTime; 
}

let devtools = false;

if(localStorage.getItem('spawnX')) {
    player.spawnX = parseFloat(localStorage.getItem('spawnX'));
    player.spawnY = parseFloat(localStorage.getItem('spawnY'));
	
    if(localStorage.getItem('deaths')) {
	player.deaths = parseFloat(localStorage.getItem('deaths'));
	savedTime = parseFloat(localStorage.getItem('time'));
    }
    
    //alert(parseFloat(localStorage.getItem('spawnX')));
} else {
	completlyRestart();
}
resetPlayer();


let resumeButton = document.getElementById('resume');
let restartButton = document.getElementById('restart');
let creditsButton = document.getElementById('credits');

restartButton.onclick = function() {
    if(confirm("Would you really like to restart? This will erase your progress.")) {
        completlyRestart();
        pause();
    }
}

resumeButton.onclick = function() {
    pause();
}

creditsButton.onclick = function() {
    if(creditsContents.style.display == 'none') {
        creditsContents.style.display = "block";
    } else {
        creditsContents.style.display = "none";
    }

}

home.onclick = function() {
    // Go up a webpage back to the homepage
    window.location = "../index.html";
}


let paused = false;
function pause() {
    if(!paused) {
        savedTime = secondsElapsed();
        startTime = new Date().getTime();
        pauseTime = savedTime;
        creditsContents.style.display = "none";


        document.getElementById('pauseMenu').style.visibility = 'visible';
        paused = true;

    } else {
        document.getElementById('pauseMenu').style.visibility = 'hidden';

        paused = false;
        startTime = new Date().getTime();
    }
}




view.x = player.x - canvas.width/2 - playerConstants.width/2;
view.y = player.y - canvas.height/2 - playerConstants.height/2;
// window.setInterval(() => {
    
//     if(fullScreen) {
//         canvas.width = document.documentElement.clientWidth;
//         canvas.height = document.documentElement.clientHeight;
//     }

//     if(keys[ESC]) {
//         pause();
//         keys[ESC] = false;
//     }


//     fill(171, 163, 201);
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.fillRect(0, 0, canvas.width, canvas.height);
    

//     renderMap();

//     renderPlayer();


//     if(!paused) {
//         handleCollisions();
//         updatePlayerPhysics();

//         if(devtools && keys[32]){
//             player.spawnX = player.x;
//             player.spawnY = player.y;
//         }


//         if(keys[RIGHT]) player.xVel += 0.3;
//         if(keys[LEFT]) player.xVel -= 0.3;

//         updateView();

//     }


 


    
//     fill(255, 0, 0);
//     context.font = "20px Arial";
//     context.fillText("Deaths: " + player.deaths, 50, 50);
//     context.fillText("Time: " + secondsElapsed().toFixed(2), 50, 70);
    
    
//     if(player.hasWon) {
//         fill(255, 255, 0);
//         context.font = "200px Arial";
//         context.fillText("YOU WIN", 100, 200);
//     }
// }, 1000/60);







let lastTime = 0;
let delta = 0;
function gameLoop(timeStep) {
    window.requestAnimationFrame(gameLoop);

    delta = timeStep - lastTime;
    lastTime = timeStep;

    if(delta > 100) {
        delta = 100;
    }

    if(fullScreen) {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    }

    if(keys[ESC]) {
        pause();
        keys[ESC] = false;
    }


    fill(171, 163, 201);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);


    renderMap();

    renderPlayer();


    if(!paused) {
        handleCollisions();
        updatePlayerPhysics(delta);

        if(devtools && keys[32]){
            player.spawnX = player.x;
            player.spawnY = player.y;
        }


        if(keys[RIGHT]) player.xVel += 0.3 * delta/16.66;
        if(keys[LEFT]) player.xVel -= 0.3 * delta/16.66;

        updateView();

    }



    fill(255, 0, 0);
    context.font = "20px Arial";
    context.fillText("Deaths: " + player.deaths, 50, 50);
    context.fillText("Time: " + secondsElapsed().toFixed(2), 50, 70);
    
    
    if(player.hasWon) {
        fill(255, 255, 0);
        context.font = "200px Arial";
        context.fillText("YOU WIN", 100, 200);
    }
}
gameLoop(0);