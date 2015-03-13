(function() {
var PLEASEWALK = {};

PLEASEWALK.ball = function() {
    var size = 20,
        movementStrength = 1,
        velocity = {
            x: 3,
            y: 3
        },
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
    function isBounded(distance) {
        return (PLEASEWALK.boardSize < (distance + size) || distance <= size)
    }

    function drawBall(context) {
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI, false);
        context.fillStyle = 'tomato';
        context.fill();
        context.stroke();
    }

    function advance() {
        position.x += velocity.x;
        position.y += velocity.y;
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
        if (isBounded(position.x)) {
            velocity.x *= -1
        }
        if (isBounded(position.y)) {
            velocity.y *= -1
        }
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
    PLEASEWALK.boardSize = 400;
    PLEASEWALK.frameRate = 10;
    var keyDirections = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN',
    },
    context,
    ball;

    function init() {
        var canvas = $('#canvas');
        canvas.attr('width', PLEASEWALK.boardSize);
        canvas.attr('height', PLEASEWALK.boardSize);
        context = canvas[0].getContext('2d');
        ball = PLEASEWALK.ball();
        bindEvents();

        gameLoop();
    }

    function clearScreen() {
        context.clearRect(0, 0, PLEASEWALK.boardSize, PLEASEWALK.boardSize);
    }

    function bindEvents() {
        $(document).keydown(function (event) {
            var key = event.which;
            var direction = keyDirections[key];
            if (direction) {
                ball.startMoving(direction);
                event.preventDefault();
            }
        });
        $(document).keyup(function (event) {
            var key = event.which;
            var direction = keyDirections[key];
            if (direction) {
                ball.stopMoving(direction);
                event.preventDefault();
            }
        });
    }


    function gameLoop() {
        clearScreen();
        ball.draw(context);
        ball.advance();
        setTimeout(gameLoop, PLEASEWALK.frameRate);
    }

    return {init: init};
})();

$(document).ready(function() {
    PLEASEWALK.game.init();
});
})();
