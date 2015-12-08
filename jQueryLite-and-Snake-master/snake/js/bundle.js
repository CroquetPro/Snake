/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	
	$(function () {
	  var rootEl = $('.snake-game');
	  new View(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
	function View($el){
	  this.$el = $el;
	  this.board = new Board(20);
	  this.setupGrid();
	
	  setInterval(this.step.bind(this), 500);
	  $(window).on("keydown", this.handleKeyEvent.bind(this));
	};
	
	
	var DIRECTIONS = {
	  38: "N",
	  40: "S",
	  37: "W",
	  39: "E"
	};
	
	View.prototype.handleKeyEvent = function (e) {
	  var code = e.keyCode;
	  if (DIRECTIONS[e.keyCode]){
	    var newDirection = DIRECTIONS[code];
	    // left = 37, up = 38, right = 39, down = 40;
	    this.board.snake.turn(newDirection);
	  };
	};
	
	
	View.prototype.step = function () {
	  if (this.board.snake.segments.length > 0) {
	      this.board.snake.move();
	      this.render();
	  } else {
	    // alert("You lose!");
	    // window.clearInterval(this.intervalId);
	  }
	};
	
	View.prototype.setupGrid = function () {
	  var html = "";
	
	  for (var i = 0; i < this.board.dim; i++) {
	    html += "<ul>";
	    for (var j = 0; j < this.board.dim; j++) {
	      html += "<li></li>";
	    }
	    html += "</ul>";
	  }
	
	  this.$el.html(html);
	  this.$li = this.$el.find("li");
	};
	
	View.prototype.render = function () {
	  // simple text based rendering
	  // this.$el.html(this.board.render());
	
	  // color rendering
	  this.updateClasses(this.board.snake.segments, "snake");
	  this.updateClasses([this.board.apple.position], "apple");
	};
	
	View.prototype.updateClasses = function(coords, className) {
	  this.$li.filter("." + className).removeClass();
	
	  coords.forEach(function(coord){
	    var flatCoord = (coord.x * this.board.dim) + coord.y;
	    this.$li.eq(flatCoord).addClass(className);
	  }.bind(this));
	};
	
	
	
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map