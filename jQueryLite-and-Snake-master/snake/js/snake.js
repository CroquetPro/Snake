function Coord (x, y) {
  this.x = x;
  this.y = y;
}

Coord.prototype.plus = function (secondCord) {
  var x = this.x + secondCord.x;
  var y = this.y + secondCord.y;
  return new Coord(x,y);
};

Coord.prototype.equals = function (secondCord) {
  return (this.x === secondCord.x && this.y === secondCord.y);
};

Coord.prototype.isOpposite = function (secondCord) {
  return (this.x + secondCord.x ===0 &&
          this.y + secondCord.y ===0)
};

var DIRECTIONS = {
  "N": new Coord(-1, 0),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1),
  "E": new Coord(0, 1)
};

var BLANK_SYMBOL = " ";
var SNAKE_SYMBOL = "S";
var APPLE_SYMBOL = "A";

function Board (dim) {
  this.dim = dim;
  this.snake = new Snake(this);
  this.apple = new Apple(this);
}

Board.prototype.setupGrid = function (dim) {
  var grid = [];
  for (var i = 0; i < dim; i++) {
    var row = [];
    for (var j = 0; j < dim; j++) {
      row.push(Board.BLANK_SYMBOL);
    }
    grid.push(row);
  }

  return grid;
};

Board.prototype.render = function () {
  var grid = Board.setupGrid(this.dim);

  this.snake.segments.forEach(function (segment) {
    grid[segment.x][segment.y] = SNAKE_SYMBOL;
  });

  grid[this.apple.position.x][this.apple.position.y] = APPLE_SYMBOL;

  // join it up
  var rowStrs = [];
  grid.map(function (row) {
    return row.join("");
  }).join("\n");
};

Board.prototype.validPosition = function (coord) {
  return (coord.x >= 0) && (coord.x < this.dim) &&
    (coord.y >= 0) && (coord.y < this.dim);
};


function Snake (board) {
  this.board = board;
  this.direction = "N"; // E, S, W
  var center = Math.floor(board.dim/2);
  this.segments = [new Coord(center, center),
                  new Coord(center +1, center),
                  new Coord(center +2, center)];
}

Snake.prototype.head = function () {
  return this.segments[0];
};

Snake.prototype.isOccupying = function (array) {
  var result = false;
  this.segments.forEach(function (segment) {
    if (segment.x === array[0] && segment.y === array[1]) {
      result = true;
      return result;
    }
  });
  return result;
};

Snake.prototype.isValid = function () {
  var head = this.head();

  if (!this.board.validPosition(head)){
    return false;
  }

  for (var i = 1; i < this.segments.length - 1; i++) {
    if (this.segments[i].equals(head)) {
      return false;
    }
  }

  return true;
};

Snake.prototype.move = function () {
  this.segments.unshift(this.head().plus(DIRECTIONS[this.direction]));
  this.segments.pop();

  if (!this.isValid()) {
    this.segments = [];
    alert("game over");
  }
};

Snake.prototype.turn = function (newDirection) {
  if (!DIRECTIONS[this.direction].isOpposite(DIRECTIONS[newDirection])){
    this.direction = newDirection;
  }
};

function Apple(board) {
  this.board = board;
  this.position = new Coord(0,0);
}

module.exports = Board;
