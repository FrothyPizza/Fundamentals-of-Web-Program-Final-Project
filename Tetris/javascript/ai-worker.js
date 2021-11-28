
if(typeof window === 'undefined') {
    self.importScripts('../javascript/tetris-gamestate.js');
    self.importScripts('../javascript/constants.js');
    self.importScripts('../javascript/tetris-ai.js');

    let move = [];

    self.addEventListener("message", function(e) {
        let args = e.data.args;


        args[0].__proto__ = TetrisGameState.prototype;
        

        let gameState = args[0];
        let curMino = args[1];
        let nextList = args[2];


        this.postMessage(getAIMove(gameState, curMino, nextList));

    }, false);

    function getAIMove(gameState, curMino, nextList) {
        return findBestMovesDFS(gameState, curMino, nextList, 0, 2);

    }
}