(function() {
$(document).ready(function() {
var gameState = {
    boardSize: 400,
    ballSize: 20,
    frameRate: 10,
    velocity: {
        x: 1,
        y: 1
    },
    position: {
        x: 41,
        y: 1
    }
};
var context;


function init() {
    var canvas = $('#canvas');
    canvas.attr('width', gameState.boardSize);
    canvas.attr('height', gameState.boardSize);
    context = canvas[0].getContext('2d');
        
    context.fillStyle = 'tomato';

    gameLoop();
}

function isBounded(position) {
    return (gameState.boardSize < (position + gameState.ballSize) || position <= 0)
}

function gameLoop() {
    context.clearRect(0,0, gameState.boardSize, gameState.boardSize);
    context.fillRect(gameState.position.x, gameState.position.y, gameState.ballSize, gameState.ballSize);
    gameState.position.x = gameState.position.x + gameState.velocity.x;
    gameState.position.y = gameState.position.y + gameState.velocity.y;
    if (isBounded(gameState.position.x)) {
        gameState.velocity.x *= -1
    }
    if (isBounded(gameState.position.y)) {
        gameState.velocity.y *= -1
    }
    setTimeout(gameLoop, gameState.frameRate);
}

init();
});
})();
