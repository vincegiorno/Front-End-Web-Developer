// Enemies our player must avoid
var Enemy = function(speed, col, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.width = 101/2;
    this.height = 171/3;
    this.speed = speed;
    this.pause = false;
    this.x = cCol(col);
    this.y = cRow(row);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (pause === false) {
        this.x += this.speed*dt;
    }
    if (this.x > 505*1.5) {
        this.x = cCol(0)
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.width = 101/2;
    this.height = 171/3;
    this.x = cCol(3);
    this.y = cRow(6);
};

Player.prototype.update = function () {
    if (Math.floor(this.y) === Math.floor(cRow(1))) {
        succeed.play();
        this.x = cCol(3);
        this.y = cRow(6);
    }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (op) {
    if (pause === false) {
        if (op === 'left' && this.x !== 0) {
            if (leftBarrier(this.x, this.y, barrier.positions)) {
                this.x -= 101
            }
        }
        else if (op === 'right' && this.x !== 404) {
            if (rightBarrier(this.x, this.y, barrier.positions)) {
                this.x += 101
            }
        }
        else if (op === 'up' && Math.floor(this.y) !== -28) {
            if (upBarrier(this.x, this.y, barrier.positions)) {
                this.y -= 83
            }
        }
        else if (op === 'down' && Math.floor(this.y) !== 387) {
            if (downBarrier(this.x, this.y, barrier.positions)) {
                this.y += 83
            }
        }
    }
    if (op === 'pause' && pause === false) {
        pause = true;
        theme.stop()
    }
    else if (op === 'pause' && pause === true) {
        pause = false;
        theme.play()
    }
};

var Barrier = function () {
    this.sprite = 'images/Rock.png';
    this.positions = [
        {'col': 2, 'row': 2},
        {'col': 4, 'row': 4}
    ]
};

Barrier.prototype.render = function () {
    var sprite = this.sprite;
    this.positions.forEach(function (pos) {
        ctx.drawImage(Resources.get(sprite), cCol(pos.col), cRow(pos.row));
    });
};

var Info = function () {
    this.text = 'Press "Space" to pause or resume';
    this.sprite = 'images/Heart.png';
    this.life = 3;
    this.level = 1
};

Info.prototype.render = function () {
    ctx.font = '18pt sans-serif';
    ctx.fillStyle = 'yellow';
    ctx.fillText('Lvl: ' + this.level, 20, 100);
    ctx.font = '15pt sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText('✖  ' + this.life, 45, 575);
    ctx.font = '11pt sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(this.text, 270, 575);
    ctx.drawImage(Resources.get(this.sprite), 10, 540, 101/3.5, 171/3.5);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(100,1,2), new Enemy(200,1,3)];
var player = new Player();
var info = new Info();
var barrier = new Barrier();
var pause = false;

function cCol(col) {
    return (col-1)*101
}

function cRow(row) {
    return (row-2)*83+83/3*2
}

function leftBarrier(x, y, positions) {
    for (var i = 0; i < positions.length; i++) {
        if ((x-101) === cCol(positions[i].col) && Math.floor(y) === Math.floor(cRow(positions[i].row))) {
            return false
        }
    }
    return true
}

function rightBarrier(x, y, positions) {
    for (var i = 0; i < positions.length; i++) {
        if ((x+101) === cCol(positions[i].col) && Math.floor(y) === Math.floor(cRow(positions[i].row))) {
            return false
        }
    }
    return true
}

function upBarrier(x, y, positions) {
    for (var i = 0; i < positions.length; i++) {
        if ((x) === cCol(positions[i].col) && Math.floor(y-83) === Math.floor(cRow(positions[i].row))) {
            return false
        }
    }
    return true
}

function downBarrier(x, y, positions) {
    for (var i = 0; i < positions.length; i++) {
        if ((x) === cCol(positions[i].col) && Math.floor(y+83) === Math.floor(cRow(positions[i].row))) {
            return false
        }
    }
    return true
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'pause'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
