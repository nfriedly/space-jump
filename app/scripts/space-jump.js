/* exported: SpaceJump */
/* globals Player, Canvas, Input, Platforms */

(function () {
  'use strict';

  /*
   function Point(x, y) {
   this.x = x;
   this.y = y;
   }

   Point.prototype.toString = function () {
   return ['(', this.x, ', ', this.y, ')'].join('');
   };
   */

  var states = {
    START: 'start',
    PLAYING: 'playing',
    WIN: 'win'
  };

  var gameState = states.START;

  var lastTick = Date.now();

  function tick() {
    var now = Date.now();
    var elapsed = (now - lastTick) / 1000;
    lastTick = now;


    var inputs = Input.getInputs();

    switch (gameState) {
      case states.START:
        if (inputs.up) {
          gameState = states.PLAYING;
        } else {
          Canvas.render();
          Canvas.drawDialog('Escape the planet\'s gravity!\nPress \u2191\u20de or touch screen.', 'rgba(10, 4, 133, 0.8)');
        }
        break;
      case states.PLAYING:
        Player.tick(elapsed, inputs);
        if (Player.y > Platforms.GAME_HEIGHT + Canvas.height / 2) {
          gameState = states.WIN;
        }
        Canvas.render();
        break;
      case states.WIN:
        Canvas.render();
        Canvas.drawDialog('You win!', 'rgba(30, 255, 30, 0.8');
        break;
    }
    requestAnimationFrame(tick);
  }


  tick();

}());
