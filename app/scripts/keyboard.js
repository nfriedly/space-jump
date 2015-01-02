(function(root) {
  'use strict';

  var Keyboard = {};

var UP = 'up';
var LEFT = 'left';
var RIGHT = 'right';

var keyMap = [];
keyMap[38] = UP;
keyMap[37] = LEFT;
keyMap[39] = RIGHT;
//todo: add WASD + spacebar

var inputMap = Keyboard.inputMap = {
  up: false,
  left: false,
  right: false
};

function handleKeydown(evt) {
  var dir = keyMap[evt.keyCode];
  if (dir) {
    inputMap[dir] = true;
  }
}

function handleKeyup(evt) {
  var dir = keyMap[evt.keyCode];
  if (dir) {
    inputMap[dir] = false;
  }
}

window.addEventListener('keydown', handleKeydown, true);
window.addEventListener('keyup', handleKeyup, true);


  root.Keyboard = Keyboard;

}(this));
