// Convert number of columns or rows
function cCol(col) {
    return (col-1)*101
}

function cRow(row) {
    return (row-2)*83+83/3*2
}

var Sound = function (src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
};

Sound.prototype.play = function(){
    this.sound.play();
};

Sound.prototype.stop = function(){
    this.sound.pause();
};

var die = new Sound('music/die.mp3'),
    river = new Sound('music/river.mp3'),
    theme = new Sound('music/theme.mp3');
    theme.sound.setAttribute("loop", "loop");
    kiss = new Sound('music/kiss.mp3');

// Enemies our player must avoid
var Enemy = function(speed, col, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.x = cCol(col);
    this.y = cRow(row);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (!pause && !stop) {
        var speed = this.speed;
        if (info.level === 2) {
            speed *= 1.5
        }
        if (player.god){
            speed /= 5
        }
        this.x += speed * dt;
    }
    if (this.x > ctx.canvas.width*2) {
        this.x = cCol(0)
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// For checkCollisions
Enemy.prototype.width = 101/1.5;
Enemy.prototype.height = 171/3;

// Now write your own player class
// This class requires an update(), render() and
// a move() method.

var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = cCol(3);
    this.y = cRow(6);
    this.god = false
};

Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    // If reach river
    if (info.level === 1 && Math.floor(this.y) === Math.floor(cRow(1))) {
        river.play();
        info.level += 1;
        this.x = cCol(3);
        this.y = cRow(6);
    }
};

Player.prototype.cross = function (move, x, y, positions) {
    var axisX, axisY;
    // Try to cross barrier from which direction
    if (move === 'left') {
        axisX = -101;
        axisY = 0
    } else if (move === 'right') {
        axisX = 101;
        axisY = 0
    } else if (move === 'up') {
        axisX = 0;
        axisY = -83
    } else if (move === 'down') {
        axisX = 0;
        axisY = 83
    }
    for (var i = 0; i < positions.length; i++) {
        if ((x+axisX) === cCol(positions[i].col) && Math.floor(y+axisY) === Math.floor(cRow(positions[i].row))) {
            return false
        }
    }
    return true
};

Player.prototype.move = function (op) {
    if (!pause && !stop) {
        var positions;
        if (info.level === 1) {
            positions = barrier.rock.positions
        } else {
            positions = barrier.tree.positions
        }
        if (op === 'left' && this.x !== 0) {
            if (this.cross('left', this.x, this.y, positions)) {
                this.x -= ctx.canvas.block.width
            }
        } else if (op === 'right' && this.x !== 404) {
            if (this.cross('right', this.x, this.y, positions)) {
                this.x += ctx.canvas.block.width
            }
        } else if (op === 'up' && Math.floor(this.y) !== -28) {
            if (this.cross('up', this.x, this.y, positions)) {
                this.y -= ctx.canvas.block.height
            }
        } else if (op === 'down' && Math.floor(this.y) !== 387) {
            if (this.cross('down', this.x, this.y, positions)) {
                this.y += ctx.canvas.block.height
            }
        }
    }
};

Player.prototype.input = function (op) {
    if (op === 'pause' && !pause && !stop) {
        pause = true;
        theme.stop()
    } else if (op === 'pause' && pause && !stop) {
        pause = false;
        theme.play()
    }
    if (op === 'restart' && info.life === 0) {
        stop = false;
        theme.play();
        info.life = 3;
        info.level = 1
    }
    if (op === 'god') {
        this.god = true
    }
};

var Barrier = function () {
    this.rock = {
        'image' : 'images/Rock.png',
        'positions' : [
            {'col': 1, 'row': 2},
            {'col': 2, 'row': 5},
            {'col': 3, 'row': 2},
            {'col': 3, 'row': 3},
            {'col': 4, 'row': 4},
            {'col': 5, 'row': 2}
    ]
    };
    this.tree = {
        'image' : 'images/Tree Ugly.png',
        'positions' : [
            {'col': 1, 'row': 4},
            {'col': 2, 'row': 1},
            {'col': 2, 'row': 2},
            {'col': 3, 'row': 3},
            {'col': 3, 'row': 4},
            {'col': 4, 'row': 1},
            {'col': 4, 'row': 3},
            {'col': 5, 'row': 5}
        ]
    }
};

Barrier.prototype.render = function () {
    var sprite,
        positions;
    if (info.level === 1) {
        sprite = this.rock.image;
        positions = this.rock.positions
    } else {
        sprite = this.tree.image;
        positions = this.tree.positions
    }
    positions.forEach(function (pos) {
        ctx.drawImage(Resources.get(sprite), cCol(pos.col), cRow(pos.row));
    });
};

var Key = function () {
    this.sprite = 'images/Key.png';
    this.x = cCol(1);
    this.y = cRow(1);
    this.get = false
};

Key.prototype = Object.create(Enemy.prototype);
Key.prototype.constructor = Key;

Key.prototype.update = function () {
    if (info.level === 2 && Math.floor(player.y) === Math.floor(cRow(1)) && player.x === cCol(1)) {
        this.get = true
    }
    // Player bring key
    if (this.get) {
        this.x = player.x + 30;
        this.y = player.y + 50
    }
};

var Treasure = function () {
    this.sprite = {
        'closed' : 'images/chest-closed.png',
        'open' : 'images/chest-open.png',
        'girl' : 'images/char-cat-girl.png'
    };
    this.x = cCol(3);
    this.y = cRow(1);
    this.open = false
};

Treasure.prototype.update = function () {
    if (info.level === 2 && key.get && Math.floor(player.y) === Math.floor(cRow(2)) && player.x === cCol(3)) {
        this.open = true
    }
};

Treasure.prototype.render = function () {
    if (info.level === 2) {
        if (!this.open) {
            ctx.drawImage(Resources.get(this.sprite.closed), this.x, this.y);
        } else if (this.open) {
            ctx.drawImage(Resources.get(this.sprite.open), this.x, this.y);
            ctx.drawImage(Resources.get(this.sprite.girl), this.x, this.y);
        }
    }
};

var Info = function () {
    this.sprite = {
        'heart' : 'images/Heart.png',
        'speech' : 'images/SpeechBubble.png'
    };
    this.level = 1;
    this.life = 3;
    this.pause = 'Press "Space" to pause or resume';
    this.lose = 'GAME OVER!';
    this.again = 'Press Enter to Play Again';
    this.thank = 'THANK YOU';
    this.save = 'FOR SAVING ME';
    this.bug = 'FROM BUGS!'
};

Info.prototype.render = function () {
    // Level
    ctx.textAlign = 'start';
    ctx.font = '18pt sans-serif';
    ctx.fillStyle = 'yellow';
    ctx.fillText('Lvl: ' + this.level, 420, 100);

    // Life
    ctx.font = '15pt sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText('✖  ' + this.life, 45, 575);
    ctx.drawImage(Resources.get(this.sprite.heart), 10, 540, 101/3.5, 171/3.5);

    // Pause
    ctx.font = '11pt sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(this.pause, 270, 575);

    // Lose
    if (this.life === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(cCol(1.5), cRow(3.5), cCol(5), cCol(3.5));

        ctx.textAlign = 'center';
        ctx.font = '20pt sans-serif';
        ctx.fillStyle = 'yellow';
        ctx.fillText(this.lose, ctx.canvas.width/2, cCol(1.5)+210);

        ctx.font = '16pt sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(this.again, ctx.canvas.width/2, cCol(1.5)+310);

        stop = true;
        theme.stop()
    }

    // Win
    if (treasure.open) {
        ctx.drawImage(Resources.get(this.sprite.speech), 0, 80, 220, 171);

        ctx.textAlign = 'center';
        ctx.font = '16pt sans-serif';
        ctx.fillStyle = '#e5446d';
        ctx.fillText(this.thank, 105, 115);
        ctx.fillText(this.save, 105, 145);
        ctx.fillText(this.bug, 105, 175);

        if (!stop) {
            kiss.play()
        }
        stop = true;
        theme.stop();
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(120,4,2), new Enemy(160,2,3), new Enemy(220,3,4), new Enemy(260,1,5),
                  new Enemy(280,-6,2), new Enemy(240,-8,3), new Enemy(280,-7,4), new Enemy(240,-9,5)];
var player = new Player();
var barrier = new Barrier();
var key = new Key();
var treasure = new Treasure();
var info = new Info();

var pause = false;
var stop = false;

// This listens for key presses and sends the keys to your
// Player.move() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',

        13: 'restart',
        32: 'pause',
        81: 'god'
    };

    player.move(allowedKeys[e.keyCode]);
    player.input(allowedKeys[e.keyCode])
});
