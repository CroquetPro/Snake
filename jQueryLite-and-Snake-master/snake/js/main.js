var View = require('./snake-view.js');

$(function () {
  var rootEl = $('.snake-game');
  new View(rootEl);
});
