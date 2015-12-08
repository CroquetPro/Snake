var Board = require('./snake.js');

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
