
let AIfactor = {
    hole: -90,                // how bad holes are
    holeCovered: -50,         // how many blocks are above a hole (bad)
    heightVariance: -10,      // average height differance between adjacent columns
    averageHeight: -5,        // average height
    highestHeight: -5,      // highest height
    Idependency: -40,         // number of columns with 2 adjacent columns 3 higher than the one
    partialIdependency: -10,  // number of columns with 2 adjacent columns >=2 higher than this one
    surfaceParity: 2,        // https://harddrop.com/wiki/Parity

    holdPenalty: -70,         

    attack: 0, 
    attackEffeciency: 0,
    clearWithoutAttack: 0,
    clearedDoubleOrTriple: 0,
    tSpinSetup: 0,
    performedTSpin: 0,
};



const MOVE_HD = 0;
const MOVE_DD = 1;
const MOVE_R = 2;
const MOVE_L = 3;
const MOVE_RR = 4;
const MOVE_LL = 5;
const ROT_CW = 6;
const ROT_CCW = 7;
const ROT_180 = 8;
const HOLD = 9;



const SZ_MOVES = [
    [MOVE_LL, MOVE_HD],
    [MOVE_LL, MOVE_R, MOVE_HD],
    [MOVE_L, MOVE_HD],
    [MOVE_HD],
    [MOVE_RR, MOVE_HD],
    [MOVE_RR, MOVE_L, MOVE_HD],
    [MOVE_R, MOVE_R, MOVE_HD],

    [ROT_CCW, MOVE_LL, MOVE_HD],
    [MOVE_LL, ROT_CW, MOVE_HD],
    [ROT_CCW, MOVE_L, MOVE_HD],

    [ROT_CCW, MOVE_HD],

    [ROT_CW, MOVE_HD],
    [ROT_CW, MOVE_R, MOVE_HD],
    [ROT_CW, MOVE_R, MOVE_R, MOVE_HD],
    [MOVE_RR, ROT_CW, MOVE_HD],
    [ROT_CW, MOVE_RR, MOVE_HD],
];

const LJT_MOVES = [
    [MOVE_LL, MOVE_HD],
    [MOVE_LL, MOVE_R, MOVE_HD],
    [MOVE_L, MOVE_HD],
    [MOVE_HD],
    [MOVE_RR, MOVE_HD],
    [MOVE_RR, MOVE_L, MOVE_HD],
    [MOVE_R, MOVE_R, MOVE_HD],
    [MOVE_R, MOVE_HD],

    [ROT_180, MOVE_LL, MOVE_HD],
    [ROT_180, MOVE_LL, MOVE_R, MOVE_HD],
    [ROT_180, MOVE_L, MOVE_HD],
    [ROT_180, MOVE_HD],
    [ROT_180, MOVE_RR, MOVE_HD],
    [ROT_180, MOVE_RR, MOVE_L, MOVE_HD],
    [ROT_180, MOVE_R, MOVE_R, MOVE_HD],
    [ROT_180, MOVE_R, MOVE_HD],

    
    [ROT_CCW, MOVE_LL, MOVE_HD],
    [ROT_CCW, MOVE_L, MOVE_L, MOVE_HD],
    [ROT_CCW, MOVE_L, MOVE_HD],

    [ROT_CCW, MOVE_HD],

    [ROT_CCW, MOVE_R, MOVE_HD],
    [ROT_CCW, MOVE_R, MOVE_R, MOVE_HD],
    [ROT_CCW, MOVE_RR, MOVE_HD],


    [ROT_CW, MOVE_LL, MOVE_HD],
    [MOVE_LL, ROT_CW, MOVE_HD],
    [ROT_CW, MOVE_L, MOVE_HD],
    [ROT_CW, MOVE_L, MOVE_L, MOVE_HD],

    [ROT_CW, MOVE_HD],

    [ROT_CW, MOVE_R, MOVE_HD],
    [ROT_CW, MOVE_R, MOVE_R, MOVE_HD],
    [ROT_CW, MOVE_LL, MOVE_HD],
];


const O_MOVES = [
    [MOVE_LL, MOVE_HD],
    [MOVE_LL, MOVE_R, MOVE_HD],
    [MOVE_L, MOVE_HD],
    [MOVE_L, MOVE_L, MOVE_HD],
    [MOVE_L, MOVE_HD],
    [, MOVE_HD],
    [MOVE_RR, MOVE_HD],
    [MOVE_RR, MOVE_L, MOVE_HD],
    [MOVE_R, MOVE_R, MOVE_HD],
    [MOVE_R, MOVE_HD],
];

const I_MOVES = [
    [MOVE_LL, MOVE_HD],
    [MOVE_L, MOVE_L, MOVE_HD],
    [MOVE_L, MOVE_HD],

    [MOVE_HD],

    [MOVE_RR, MOVE_HD],
    [MOVE_R, MOVE_R, MOVE_HD],
    [MOVE_R, MOVE_HD],

    [ROT_CCW, MOVE_HD],
    [ROT_CCW, MOVE_L, MOVE_HD],
    [MOVE_LL, ROT_CW, MOVE_HD],
    [MOVE_LL, ROT_CCW, MOVE_HD],
    [ROT_CCW, MOVE_LL, MOVE_HD],

    [ROT_CW, MOVE_HD],
    [ROT_CW, MOVE_R, MOVE_HD],
    [ROT_CW, MOVE_R, MOVE_R, MOVE_HD],
    [MOVE_RR, ROT_CW, MOVE_HD],
    [ROT_CW, MOVE_RR, MOVE_HD],
];

function getMoves(mino) {
    if (mino == MINO_S || mino == MINO_Z)
        return SZ_MOVES;
    else if (mino == MINO_O)
        return O_MOVES;
    else if (mino == MINO_L || mino == MINO_J || mino == MINO_T)
        return LJT_MOVES;
    else if (mino == MINO_I)
        return I_MOVES;
}




function evaluate(gameState) {
    let score = 0;

    // if dead (need to work on this)
    for (let i = 3; i < 6; ++i)
        for (let j = 3; j < 5; ++j)
            if (gameState.matrix[i][j] >= 0) return -10000;
    
    //find holes
    let holePositions = [];
    let holeCount = 0;
    let coverdHoleCount = 0;
    for (let i = 0; i < WIDTH; ++i) {
        for (let j = 0; j < HEIGHT - 1; ++j) {
            if (gameState.matrix[i + j * WIDTH] >= 0 && gameState.matrix[i + (j + 1) * WIDTH] == -1) {
                holeCount++;
                // punish long holes but only up to 4 deep
                for (let c = 0; c < 4; ++c) {
                    if (gameState.matrix[i + (j + c) * WIDTH] == -1 && gameState.matrix[i + (j + c - 1) * WIDTH] == -1) {
                        ++holeCount;
                        holePositions.push({ i, j });
                    }
                }
                // blocks above a hole
                // only up to 5
                for (let c = 0; c < 5; ++c) {
                    if (gameState.matrix[i + (j - c) * WIDTH] >= 0)
                        ++coverdHoleCount;
                }
            }
        }
    }
    score += holeCount * AIfactor.hole;
    score += coverdHoleCount * AIfactor.holeCovered;


    // create an array containing column heights
    let columnHeights = [];
    columnHeights.length = WIDTH;
    for (let i = 0; i < WIDTH; ++i) {
        let thisColHeight = 0;
        for (let j = 0; j < HEIGHT; ++j) {
            // if a tile is found
            if (gameState.matrix[i + j * WIDTH] >= 0) {
                thisColHeight = HEIGHT - j;
                j = HEIGHT; // continue to next column
            }
        }
        columnHeights[i] = thisColHeight;
    }


    // calculate average height
    let averageHeight = 0;
    let highestHeight = 0;
    for (let i = 0; i < columnHeights.length; ++i) {
        averageHeight += columnHeights[i];
        if (columnHeights[i] > highestHeight) highestHeight = columnHeights[i];
    }
    averageHeight /= columnHeights.length;
    score += averageHeight * AIfactor.averageHeight;
    score += highestHeight * AIfactor.highestHeight;
    if (averageHeight > 10) score += averageHeight * AIfactor.averageHeight;


    // Calculate I dependencies and height variance
    let Idependencies = 0;
    let variance = 0;
    for (let i = 0; i < columnHeights.length; ++i) {
        let leftHeight = 0;
        let thisHeight = columnHeights[i];
        let rightHeight = 0;

        // if it isn't index 0 or last
        if (i >= 1 && i < columnHeights.length - 1) {
            variance += Math.abs(columnHeights[i - 1] - thisHeight);
            variance += Math.abs(columnHeights[i + 1] - thisHeight);
        }

        // calculate I dependecies 
        if (i == 0) leftHeight = HEIGHT;
        else leftHeight = columnHeights[i - 1];

        if (i == columnHeights.length - 1) rightHeight = HEIGHT;
        else rightHeight = columnHeights[i + 1];

        if (leftHeight - thisHeight >= 3 && rightHeight - thisHeight >= 3) Idependencies++;
    }
    score += Idependencies * AIfactor.Idependency;
    score += variance * AIfactor.heightVariance;


    // Calculate parity
    let parity = 0;
    for (let i = 0; i < columnHeights.length; ++i) {
        let color = (columnHeights[i] % 2) ^ (i % 2);
        if (color == 1) parity++;
        else parity--;
    }
    parity /= 2;
    parity = Math.abs(parity);
    score += parity * AIfactor.surfaceParity;




    // const Tshape = [
    //     ['A', 'O', '#', 'O', 'A'],
    //     ['A', '#', '#', '#', 'A'],
    //     ['1', '1', '#', '1', '1']
    // ];
    // score += shapePercentCompletion(gameState, Tshape, holePositions) * AIfactor.tSpinSetup;


    return score;
}

function evaluateAttackScore(attack, clear, tSpin) {
    let score = 0;

    // total attack sent
    score += attack * attack * AIfactor.attack; // attack squared to encourage larger clears

    if (clear == 2 || clear == 3) score += AIfactor.clearedDoubleOrTriple;

    // clear without attack
    if (clear > 0 && attack == 0) {
        score += clear * AIfactor.clearWithoutAttack + AIfactor.clearedDoubleOrTriple;
    }

    // attack efficiency
    if (clear > 0 && attack > 0) {
        score += attack / clear * AIfactor.attackEffeciency;
    }

    if (tSpin == TSPIN)
        score += clear * AIfactor.performedTSpin + AIfactor.tSpinSetup; // since this destroys a setup, increase its value by the amount lost
    else if (tSpin == TSPIN_MINI)
        score += clear * AIfactor.performedTSpin / 3;

    return score;
}






function executeMove(gameState, mino, moves, index, nextList) {
    switch (moves[index]) {
        case HOLD:
            gameState.performHold(mino, nextList);
            break;
        case MOVE_R:
            gameState.moveX(mino, 1);
            break;
        case MOVE_RR:
            gameState.arrX(mino, 1);
            break;
        case MOVE_LL:
            gameState.arrX(mino, -1);
            break;
        case MOVE_L:
            gameState.moveX(mino, -1);
            break;
        case ROT_CW:
            gameState.rotate(mino, 1);
            break;
        case ROT_CCW:
            gameState.rotate(mino, -1);
            break;
        case ROT_180:
            gameState.rotate(mino, 2);
            break;
        case MOVE_DD:
            gameState.sonicDrop(mino);
            break;
        case MOVE_HD:
            gameState.hardDrop(mino);
            return gameState.lastAttack;
            break;
        
    }
    return 0;
}



function fullyPerformMove(gameState, mino, moves, nextList) {
    let clear = 0;
    for (let i = 0; i < moves.length; ++i) {
        clear += executeMove(gameState, mino, moves, i, nextList);
    }
    return clear;
}




//****** Trying out different methods of calculating the best move ******//



// For the sake of simplcity, the AI will only consider the first move in the list
function findBestMove(gameState, mino, nextList) {

    let bestMove = {
        score: -100000,
        moves: []
    };

    let allMoves = getMoves(mino);
    
    for (let i = 0; i < allMoves.length; ++i) {
        let newMino = new Tetromino(mino);
        let newGameState = gameState.clone();
        
        // Copy the move into move
        let move = allMoves[i].slice();

        let clear = fullyPerformMove(newGameState, newMino, move, nextList);
        let attack = newGameState.lastAttack;
        let tSpin = newGameState.lastTSpin;
        
        let attackScore = 0; //evaluateAttackScore(attack, clear, tSpin);
        let moveScore = evaluate(newGameState);

        let score = attackScore + moveScore;


        if (score > bestMove.score) {
            bestMove.score = score;
            bestMove.moves = move;
        }
    }

    if(gameState.canHold) {
        let holdNext = nextList.slice();
        let holdState = gameState.clone();
        let holdMino = new Tetromino(mino);
        holdState.performHold(holdMino, holdNext);

        let allMovesWithHold = getMoves(holdMino.mino);
        for (let i = 0; i < allMovesWithHold.length; ++i) {
            let newMino = new Tetromino(holdMino);
            let newGameState = holdState.clone();
            let move = allMovesWithHold[i].slice();

            let clear = fullyPerformMove(newGameState, newMino, move, holdNext);
            let attack = newGameState.lastAttack;
            let tSpin = newGameState.lastTSpin;

            let attackScore = 0; //evaluateAttackScore(attack, clear, tSpin);
            let moveScore = evaluate(newGameState);

            let score = attackScore + moveScore + AIfactor.holdPenalty;

            if (score > bestMove.score) {
                bestMove.score = score;
                bestMove.moves = [HOLD];
                return bestMove;
            }
        }
    }



    return bestMove;
}







// Search for the best move using a depth-first search
function findBestMoveDFS(gameState, mino, nextList, depth) {
    
    let bestMove = {
        score: -100000,
        moves: []
    };

    let allMoves = getMoves(mino);

    for (let i = 0; i < allMoves.length; ++i) {
        let newMino = new Tetromino(mino);
        let newGameState = gameState.clone();
        
        // Copy the move into move
        let move = allMoves[i].slice();
        move.push(MOVE_HD);

        let clear = fullyPerformMove(newGameState, newMino, move, nextList);
        let attack = newGameState.lastAttack;
        let tSpin = newGameState.lastTSpin;
        
        let attackScore = 0; //evaluateAttackScore(attack, clear, tSpin);
        let moveScore = evaluate(newGameState);

        let score = attackScore + moveScore;

        if (depth > 0) {
            let newMino = nextList[0];
            let newNextList = nextList.slice(1);
            let newGameState = gameState.clone();
            let newDepth = depth - 1;
            let newBestMove = findBestMoveDFS(newGameState, newMino, newNextList, newDepth);
            score += newBestMove.score;
        }

        if (score > bestMove.score) {
            bestMove.score = score;
            bestMove.moves = move;
        }
    }

    bestMove.moves.push(MOVE_HD);
    return bestMove;
}




function findBestMove2(currentState, minoIndex, nextList, thisPathAttackScore, depth) {
    let bestMove = [];
    let bestScore = -10000;

    let allMoves = getMoves(minoIndex);
    let allNewStates = [];
    let evaluations = [];
    let attackEvaluations = [];

    for (let i = 0; i < allMoves.length; ++i) {
        let newState = currentState.clone();
        let mino = new Tetromino(minoIndex);
        let newNext = nextList.slice();

        fullyPerformMove(newState, mino, allMoves[i], newNext);
        let evaluation = evaluate(newState);
        let atkScore = evaluateAttackScore(
            AIfactor, newState.lastAttack, newState.lastClear, newState.lastTSpin
        );
        //evaluation += atkScore;

        attackEvaluations.push(atkScore);
        evaluations.push(evaluation);
        allNewStates.push(newState);
    }


    if (depth == 0) {
        for (let i = 0; i < evaluations.length; ++i) {
            if (evaluations[i] + attackEvaluations[i] > bestScore) {
                bestMove = allMoves[i];
                bestScore = evaluations[i] + attackEvaluations[i];
            }
        }
    } else {
        let bestMovesToBeConsidered = AI_SEARCH_WIDTH;
        if (minoIndex == MINO_O && AI_SEARCH_WIDTH > 8) bestMovesToBeConsidered = 8;
        if (bestMovesToBeConsidered > allMoves.length) bestMovesToBeConsidered = allMoves.length;

        let bestIndexes = [];
        for (let i = 0; i < bestMovesToBeConsidered; ++i) {
            let bestIndex = 0;
            let bestEvaluation = -10000;
            // loop through all evaluations and find the best one that hasn't already been considered
            for (let j = 0; j < evaluations.length; ++j) {
                let bestIndexesHasJ = false;
                for (let c = 0; c < bestIndexes.length; ++c)
                    if (j == bestIndexes[c]) // if the index being considered has already been added, don't add it
                        bestIndexesHasJ = true;
                if (evaluations[j] > bestEvaluation && bestIndexesHasJ == false) {
                    bestEvaluation = evaluations[j];
                    bestIndex = j;
                }
            }
            bestIndexes.push(bestIndex);

        }
        for (let i = 0; i < bestIndexes.length; ++i) {
            let thisState = allNewStates[bestIndexes[i]];
            let thisMino = new Tetromino(nextList[0]);
            let newNext = nextList.slice();
            let move = findBestMove(thisState, nextList[0], newNext, thisPathAttackScore + attackEvaluations[bestIndexes[i]], depth - 1);
            fullyPerformMove(thisState, thisMino, move, newNext);

            let evaluation = evaluate(thisState) + evaluateAttackScore(
                AIfactor, thisState.lastAttack, thisState.lastClear, thisState.lastTSpin
            );

            if (evaluation > bestScore) {
                bestScore = evaluation;
                bestMove = allMoves[bestIndexes[i]];
                i = bestIndexes.length; // if holding is better, don't evaluate any more
            }
        }
    }

    return bestMove;
}