// Enemies our player must avoid
var Enemy = function(speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.width = 101/2;
    this.height = 171/3;
    this.speed = speed;
    this.x = 0;
    this.y = 83/3*2;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // this.x += this.speed*dt;
    if (this.x > 101*5*1.5) {
        this.x = -101
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
    this.x = 101*2;
    this.y = 83*4 + 83/3*2;
};

Player.prototype.update = function () {
    if (Math.floor(this.y) === Math.floor(83/3*2 - 83)) {
        this.x = 101*2;
        this.y = 83*4 + 83/3*2;
    }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (direction) {
    if (direction === 'left') {
        this.x -= 101
    }
    else if (direction === 'right') {
        this.x += 101
    }
    else if (direction === 'up') {
        this.y -= 83
    }
    else if (direction === 'down') {
        this.y += 83
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(100), new Enemy(200)];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
