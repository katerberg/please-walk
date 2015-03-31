(function() {
var PLEASEWALK = {};

PLEASEWALK.winTarget = function() {
    coordinates = {}

    function getSize(baseSize) {
        var maxSize = baseSize * 0.1;
        var minSize = baseSize * 0.05;
        return Math.floor(Math.random() * maxSize + minSize);
    }

    function getPosition(size) {
        return Math.floor(Math.random() * size);
    }

    function init() {
        coordinates.width = getSize(PLEASEWALK.boardSize.x);
        coordinates.height = getSize(PLEASEWALK.boardSize.y);
        coordinates.x = getPosition(PLEASEWALK.boardSize.x - coordinates.width)
        coordinates.y = getPosition(PLEASEWALK.boardSize.y - coordinates.height)
    }

    function draw(context) {
        var color = '#70AF00';
        context.beginPath();
        context.strokeStyle = color;
        context.fillStyle = color;
        context.strokeRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
        context.fillRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
        context.closePath();
    }

    init()

    return {
        coordinates: coordinates,
        draw: draw
    };
}

PLEASEWALK.character = function() {
    var radius = 20,
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

    function drawCharacter(context) {
        var color = 'tomato';
        context.beginPath();
        context.strokeStyle = color;
        context.fillStyle = color;
        context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
        context.stroke();
        context.closePath();
        context.fill();
    }

    function handleBounding(direction) {
        if (position[direction] < radius) {
            position[direction] += movementStrength;
        }
        if (position[direction] > (PLEASEWALK.boardSize[direction] - radius)) {
            position[direction] -= movementStrength;
        }
    }

    function isInside(x, y, width, height) {
        var distX = Math.abs(position.x - x - width / 2);
        var distY = Math.abs(position.y - y - height / 2);

        if (distX > (width / 2 + radius)) {
            return false;
        }
        if (distY > (height / 2 + radius)) {
            return false;
        }

        if (distX <= (width / 2)) {
            return true;
        }
        if (distY <= (height / 2)) {
            return true;
        }

        var dx = distX - width / 2;
        var dy = distY - height / 2;
        return (dx * dx + dy * dy <= (radius * radius));
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
        draw: drawCharacter,
        advance: advance,
        startMoving: startMoving,
        stopMoving: stopMoving,
        isInside: isInside
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
    score,
    character,
    winTarget;

    function init() {
        var canvas = $('#canvas');
        score = 0;
        $('#score').text(score)
        canvas.attr('width', PLEASEWALK.boardSize.x);
        canvas.attr('height', PLEASEWALK.boardSize.y);
        context = canvas[0].getContext('2d');
        character = PLEASEWALK.character();
        winTarget = PLEASEWALK.winTarget()
        bindEvents();

        gameLoop();
    }

    function checkWin() {
        if (character.isInside(winTarget.coordinates.x, winTarget.coordinates.y, winTarget.coordinates.width, winTarget.coordinates.height)) {
            $('#score').text(++score)
            winTarget = PLEASEWALK.winTarget();
        }
    }

    function clearScreen() {
        context.clearRect(0, 0, PLEASEWALK.boardSize.x, PLEASEWALK.boardSize.y);
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
        winTarget.draw(context);
        character.advance();
        checkWin()
        setTimeout(gameLoop, PLEASEWALK.frameRate);
    }

    return {init: init};
})();

$(document).ready(function() {
    PLEASEWALK.game.init();
});
})();
