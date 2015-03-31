(function() {
var PLEASEWALK = {};

PLEASEWALK.character = function() {
    var size = 20,
        movementStrength = 1,
        position = {
            x: 41,
            y: 21
        },
        moving = {
            LEFT: false,
            RIGHT: false,
            UP: false,
            DOWN: false
        };

    function drawBall(context) {
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI, false);
        context.fillStyle = 'tomato';
        context.fill();
        context.stroke();
    }
    function handleBounding(direction) {
        if (position[direction] < size) {
            position[direction] += movementStrength;
        }
        if (position[direction] > (PLEASEWALK.boardSize[direction] - size)) {
            position[direction] -= movementStrength;
        }
    }

    function advance() {
        if (moving.LEFT) {
            position.x -= movementStrength;
        }
        if (moving.RIGHT) {
            position.x += movementStrength;
        }
        if (moving.UP) {
            position.y -= movementStrength;
        }
        if (moving.DOWN) {
            position.y += movementStrength;
        }
        handleBounding('x');
        handleBounding('y');
    }

    function startMoving(direction) {
        moving[direction] = true;
    }

    function stopMoving(direction) {
        moving[direction] = false;
    }

    return {
        draw: drawBall,
        advance: advance,
        startMoving: startMoving,
        stopMoving: stopMoving
    };
};


PLEASEWALK.game = (function() {
    PLEASEWALK.boardSize = {y: 600, x: 1000};
    PLEASEWALK.frameRate = 10;
    var keyDirections = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN',
    },
    context,
    character;

    function init() {
        var canvas = $('#canvas');
        canvas.attr('width', PLEASEWALK.boardSize.x);
        canvas.attr('height', PLEASEWALK.boardSize.y);
        context = canvas[0].getContext('2d');
        character = PLEASEWALK.character();
        bindEvents();

        gameLoop();
    }

    function clearScreen() {
        context.clearRect(0, 0, PLEASEWALK.boardSize.y, PLEASEWALK.boardSize.y);
    }

    function bindEvents() {
        $(document).keydown(function (event) {
            var key = event.which;
            var direction = keyDirections[key];
            if (direction) {
                character.startMoving(direction);
                event.preventDefault();
            }
        });
        $(document).keyup(function (event) {
            var key = event.which;
            var direction = keyDirections[key];
            if (direction) {
                character.stopMoving(direction);
                event.preventDefault();
            }
        });
    }


    function gameLoop() {
        clearScreen();
        character.draw(context);
        character.advance();
        setTimeout(gameLoop, PLEASEWALK.frameRate);
    }

    return {init: init};
})();

$(document).ready(function() {
    PLEASEWALK.game.init();
});
})();
